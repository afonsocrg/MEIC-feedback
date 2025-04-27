import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import CourseGrid from '../components/CourseGrid'
import Header from '../components/Header'
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <motion.main
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-istBlue mb-2">
            Course Feedback
          </h1>
          <p className="text-gray-600 mb-4">
            Wondering which courses to take next semester? Discover what each
            course is truly like through honest feedback from your peers.
          </p>
          <div className="bg-white rounded-xl shadow-md px-6 py-4 mb-8 flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="flex-1 flex flex-col min-w-[120px]">
              <label
                htmlFor="period"
                className="text-xs font-semibold text-gray-500 mb-1"
              >
                Period
              </label>
              <select
                id="period"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="">All</option>
                {availablePeriods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col min-w-[160px]">
              <label
                htmlFor="specialization"
                className="text-xs font-semibold text-gray-500 mb-1"
              >
                Specialization
              </label>
              <select
                id="specialization"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
                value={selectedSpecialization ?? ''}
                onChange={(e) =>
                  setSelectedSpecialization(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">All</option>
                {specializations.map((specialization) => (
                  <option key={specialization.id} value={specialization.id}>
                    {specialization.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col min-w-[160px]">
              <label
                htmlFor="sort"
                className="text-xs font-semibold text-gray-500 mb-1"
              >
                Sort by
              </label>
              <select
                id="sort"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="rating">Highest Rating</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
            <div className="flex-[2] flex flex-col min-w-[200px]">
              <label
                htmlFor="search"
                className="text-xs font-semibold text-gray-500 mb-1"
              >
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or acronym..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-istBlue focus:border-transparent bg-gray-50 text-gray-700 transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
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
