import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import CourseGrid from '../components/CourseGrid'
import SearchBar from '../components/SearchBar'
import {
  getCourses,
  getSpecializations,
  type Course,
  type Specialization
} from '../services/meicFeedbackAPI'

type SortOption = 'rating' | 'alphabetical' | 'reviews'

const STORAGE_KEYS = {
  PERIOD: 'meic-feedback-period',
  SPECIALIZATION: 'meic-feedback-specialization',
  SORT: 'meic-feedback-sort'
}

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useLocalStorage<string>(
    STORAGE_KEYS.PERIOD,
    ''
  )
  const [selectedSpecialization, setSelectedSpecialization] = useLocalStorage<
    number | null
  >(STORAGE_KEYS.SPECIALIZATION, null)
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([])
  const [sortBy, setSortBy] = useLocalStorage<SortOption>(
    STORAGE_KEYS.SORT,
    'rating'
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, specializationsData] = await Promise.all([
          getCourses(),
          getSpecializations()
        ])
        setCourses(coursesData)
        setSpecializations(specializationsData)
        // Extract unique periods and sort them
        const periods = [
          ...new Set(coursesData.map((course) => course.period))
        ].sort()
        setAvailablePeriods(periods)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCourses = courses
    .filter((course) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        course.name.toLowerCase().includes(searchLower) ||
        course.acronym.toLowerCase().includes(searchLower)
      const matchesPeriod = !selectedPeriod || course.period === selectedPeriod
      const matchesSpecialization =
        !selectedSpecialization ||
        specializations
          .find((s) => s.id === selectedSpecialization)
          ?.courseIds.includes(course.id)
      return matchesSearch && matchesPeriod && matchesSpecialization
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'alphabetical':
          return a.name.localeCompare(b.name)
        case 'reviews':
          return (b.feedbackCount || 0) - (a.feedbackCount || 0)
        default:
          return 0
      }
    })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300 }
    }
  }

  return (
    <div>
      <motion.main
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-istBlue mb-4">
                Wondering which courses to take next semester?
              </h4>
              <p className="text-gray-700 mb-6">
                Discover what each course is truly like through{' '}
                <span className="font-bold">honest feedback</span> from your
                peers.
              </p>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-istBlue mb-4">
                Finding this project useful?
              </h4>
              <p className="text-gray-700 mb-6">
                Help other students by{' '}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe3ptJwi8uyQfXI8DUmi03dwRL0m7GJa1bMU_6mJpobmXl8NQ/viewform?usp=dialog"
                  className="text-istBlue hover:text-istBlueDark font-medium underline"
                >
                  giving your feedback
                </a>{' '}
                on courses you've already taken!
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} id="course-list">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedSpecialization={selectedSpecialization}
            setSelectedSpecialization={setSelectedSpecialization}
            sortBy={sortBy}
            setSortBy={setSortBy}
            availablePeriods={availablePeriods}
            specializations={specializations}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : filteredCourses.length > 0 ? (
            <CourseGrid courses={filteredCourses} />
          ) : (
            <div className="text-gray-600 text-center py-8">
              {searchQuery || selectedPeriod
                ? 'No courses match your filters.'
                : 'No courses loaded yet. Please try again later.'}
            </div>
          )}
        </motion.div>
      </motion.main>
    </div>
  )
}

export default Home
