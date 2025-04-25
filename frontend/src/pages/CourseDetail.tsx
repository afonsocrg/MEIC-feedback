import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import {
  getCourse,
  getCourseFeedback,
  type CourseDetail,
  type Feedback
} from '../services/meicFeedbackAPI'

const CourseDetail: React.FC = () => {
  const location = useLocation()
  const courseId = location.state?.courseId
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return

      try {
        setIsLoading(true)
        const [courseData, feedbackData] = await Promise.all([
          getCourse(parseInt(courseId)),
          getCourseFeedback(parseInt(courseId))
        ])
        setCourse(courseData)
        setFeedback(feedbackData)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load course data'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500 text-center py-8">{error}</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">Course not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <motion.main
        className="container mx-auto px-4 py-8 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-[#009de0] mb-4">
            {course.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <p className="text-gray-600">{course.acronym}</p>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-gray-700">
                {(course.rating ?? 0).toFixed(1)}
              </span>
              <span className="text-gray-500 ml-2">
                ({course.feedbackCount} reviews)
              </span>
            </div>
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#009de0] hover:underline cursor-pointer"
            >
              Fénix URL
            </a>
          </div>

          <p className="text-gray-600 mb-8">{course.description}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Student Feedback
            </h2>
          </div>
          {feedback.length === 0 ? (
            <p className="text-gray-600">No feedback yet</p>
          ) : (
            <div className="space-y-4">
              {feedback.map((f) => (
                <motion.div
                  key={f.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`text-2xl ${
                              index < f.rating
                                ? 'text-yellow-500'
                                : 'text-gray-200'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-4">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {f.comment && <p className="text-gray-600">{f.comment}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.main>
    </div>
  )
}

export default CourseDetail
