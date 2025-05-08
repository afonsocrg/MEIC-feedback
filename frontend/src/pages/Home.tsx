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
      {/* Hero Section */}
      <div className="bg-blue-50 py-12 px-4 md:px-0 mb-10 rounded-b-3xl shadow-sm">
        <div className="container mx-auto flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-istBlue mb-4">
            Find the best MEIC courses
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl">
            Honest, anonymous student reviews to help you choose the right
            courses.
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-2 items-center justify-center">
            {/* Button 1 + Desc 1 */}
            <div className="flex flex-col items-center w-full max-w-[180px]">
              <button
                className="bg-istBlue hover:bg-istBlueDark text-white font-semibold py-3 w-full max-w-[180px] rounded-lg shadow transition-all text-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:ring-offset-2"
                onClick={() => {
                  const el = document.getElementById('course-list')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Browse Courses
              </button>
              <span className="text-gray-400 text-xs md:text-sm font-medium w-full max-w-[180px] text-center mt-2 break-words">
                See what students really think about each course.
              </span>
            </div>
            {/* Button 2 + Desc 2 */}
            <div className="flex flex-col items-center w-full max-w-[180px]">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSe3ptJwi8uyQfXI8DUmi03dwRL0m7GJa1bMU_6mJpobmXl8NQ/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-2 border-istBlue text-istBlue hover:bg-istBlue hover:text-white font-semibold py-3 w-full max-w-[180px] rounded-lg shadow transition-all text-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:ring-offset-2"
              >
                Give Feedback
              </a>
              <span className="text-gray-400 text-xs md:text-sm font-medium w-full max-w-[180px] text-center mt-2 break-words">
                Help your peers by sharing your honest review!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar and Course List */}
      <motion.main
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
