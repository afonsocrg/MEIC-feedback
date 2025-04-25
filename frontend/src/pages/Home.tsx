import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Chip from '../components/Chip'
import CourseGrid from '../components/CourseGrid'
import Header from '../components/Header'
import { getCourses, type Course } from '../services/meicFeedbackAPI'

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
        // Extract unique periods and sort them
        const periods = [...new Set(data.map((course) => course.period))].sort()
        setAvailablePeriods(periods)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      course.name.toLowerCase().includes(searchLower) ||
      course.acronym.toLowerCase().includes(searchLower)
    const matchesPeriod = !selectedPeriod || course.period === selectedPeriod
    return matchesSearch && matchesPeriod
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
          <h1 className="text-3xl font-bold text-[#009de0] mb-2">
            Course Feedback
          </h1>
          <p className="text-gray-600 mb-4">
            Wondering which courses to take next semester? Discover what each
            course is truly like through honest feedback from your peers.
          </p>
          <div className="flex flex-col gap-4 mb-8">
            <input
              type="text"
              placeholder="Search courses by name or acronym..."
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009de0] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Chip
                label="All Periods"
                className={`cursor-pointer ${
                  !selectedPeriod ? 'bg-[#009de0] text-white' : ''
                }`}
                onClick={() => setSelectedPeriod('')}
              />
              {availablePeriods.map((period) => (
                <Chip
                  key={period}
                  label={period}
                  className={`cursor-pointer ${
                    selectedPeriod === period ? 'bg-[#009de0] text-white' : ''
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                />
              ))}
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
