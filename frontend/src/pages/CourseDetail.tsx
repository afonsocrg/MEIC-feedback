import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Chip from '../components/Chip'
import Header from '../components/Header'
import SchoolYearSection from '../components/SchoolYearSection'
import WarningAlert from '../components/WarningAlert'
import {
  getCourse,
  getCourseFeedback,
  getCourseIdFromAcronym,
  type CourseDetail,
  type Feedback
} from '../services/meicFeedbackAPI'

// Helper function to get school year from a date
const getSchoolYear = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth() returns 0-11

  // If month is September or later, it's the start of the next school year
  if (month >= 9) {
    return `${year}/${year + 1}`
  } else {
    return `${year - 1}/${year}`
  }
}

// Helper function to get current school year
const getCurrentSchoolYear = (): string => {
  return getSchoolYear(new Date())
}

// Helper function to check if a school year is outdated
const isSchoolYearOutdated = (schoolYear: string): boolean => {
  const currentYear = getCurrentSchoolYear()
  const [currentStart] = currentYear.split('/').map(Number)
  const [, yearEnd] = schoolYear.split('/').map(Number)

  // A school year is outdated if it's more than 2 years behind the current one
  return yearEnd < currentStart - 1
}

// Helper function to group feedback by school year
const groupFeedbackBySchoolYear = (
  feedback: Feedback[]
): Map<string, Feedback[]> => {
  const grouped = new Map<string, Feedback[]>()

  feedback.forEach((f) => {
    const schoolYear = getSchoolYear(new Date(f.createdAt))
    if (!grouped.has(schoolYear)) {
      grouped.set(schoolYear, [])
    }
    grouped.get(schoolYear)?.push(f)
  })

  return grouped
}

const CourseDetail: React.FC = () => {
  const location = useLocation()
  const { acronym } = useParams()
  const courseId = location.state?.courseId
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true)

        let cid = courseId

        if (!cid) {
          if (!acronym) {
            console.error('This code should be unreachable')
            throw new Error('No course identifier provided')
          }
          cid = await getCourseIdFromAcronym(acronym)
        }
        const courseData = await getCourse(cid)
        const feedbackData = await getCourseFeedback(cid)
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
  }, [courseId, acronym])

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
          <h1 className="text-3xl font-bold text-istBlue mb-4">
            {course.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <p className="text-gray-600">{course.acronym}</p>
            {course.period && <Chip label={course.period} />}
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
              className="text-istBlue hover:underline cursor-pointer"
            >
              Fénix
            </a>
          </div>

          <p className="text-gray-600 mb-8">{course.description}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Student Feedback
            </h2>
            <Link
              to="https://docs.google.com/forms/d/e/1FAIpQLSe3ptJwi8uyQfXI8DUmi03dwRL0m7GJa1bMU_6mJpobmXl8NQ/viewform?usp=dialog"
              target="_blank"
              className="text-istBlue hover:underline cursor-pointer"
            >
              Add Your Feedback
            </Link>
          </div>
          {feedback.length === 0 ? (
            <p className="text-gray-600">No feedback yet</p>
          ) : (
            <div className="space-y-4">
              {Array.from(groupFeedbackBySchoolYear(feedback).entries())
                .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
                .map(([schoolYear, yearFeedback], index, array) => {
                  const isOutdated = isSchoolYearOutdated(schoolYear)
                  const isFirstOutdated =
                    isOutdated &&
                    (index === 0 || !isSchoolYearOutdated(array[index - 1][0]))

                  return (
                    <>
                      {isFirstOutdated && (
                        <WarningAlert message="The feedback below this point may be outdated. Course content, teaching methods, and requirements may have changed since then." />
                      )}
                      <SchoolYearSection
                        key={schoolYear}
                        schoolYear={schoolYear}
                        feedback={yearFeedback}
                        variants={itemVariants}
                      />
                    </>
                  )
                })}
            </div>
          )}
        </motion.div>
      </motion.main>
    </div>
  )
}

export default CourseDetail
