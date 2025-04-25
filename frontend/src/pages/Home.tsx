import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import CourseGrid from '../components/CourseGrid'
import Header from '../components/Header'
import { getCourses, type Course } from '../services/meicFeedbackAPI'

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

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
          <p className="text-gray-600 mb-8">
            Browse and rate your computer science master's courses
          </p>
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
          ) : (
            <CourseGrid courses={courses} />
          )}
        </motion.div>
      </motion.main>
    </div>
  )
}

export default Home
