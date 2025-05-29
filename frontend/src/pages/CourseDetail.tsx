import {
  Chip,
  EditableSection,
  Markdown,
  SchoolYearSection,
  WarningAlert
} from '@components'
import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
import {
  getEditDescriptionFormUrl,
  getEvaluationMethodFormUrl
} from '@services/googleForms'
import {
  getCourse,
  getCourseFeedback,
  type CourseDetail,
  type Feedback
} from '@services/meicFeedbackAPI'
import { motion } from 'framer-motion'
import posthog from 'posthog-js'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Helper function to group feedback by school year
const groupReviewsBySchoolYear = (
  reviews: Feedback[]
): Map<number, Feedback[]> => {
  const grouped = new Map<number, Feedback[]>()

  reviews.forEach((f) => {
    const schoolYear = f.schoolYear
    if (!grouped.has(schoolYear)) {
      grouped.set(schoolYear, [])
    }
    grouped.get(schoolYear)?.push(f)
  })

  return grouped
}

function isSchoolYearOutdated(schoolYear: number) {
  const currentSchoolYear = getCurrentSchoolYear()

  // A school year is outdated if it's more than 2 years behind the current one
  return schoolYear < currentSchoolYear - 2
}

export function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const reviewFormUrl = useMemo(
    () => `/feedback/new${course ? `?courseId=${course.id}` : ''}`,
    [course]
  )

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true)
        const courseId = parseInt(id!, 10)
        const courseData = await getCourse(courseId)
        const feedbackData = await getCourseFeedback(courseId)
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
  }, [id])

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
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Course not found</div>
      </div>
    )
  }

  return (
    <motion.main
      className="container mx-auto px-4 py-8 max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-istBlue mb-4">{course.name}</h1>

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
      </motion.div>

      <motion.div variants={itemVariants}>
        <EditableSection
          title="What's this course really about?"
          value={course.description}
          editTooltip="Edit description"
          getEditUrl={() => getEditDescriptionFormUrl(course)}
          renderContent={(value) => <Markdown>{value}</Markdown>}
          fallback={
            <p className="text-gray-600 italic">
              We don't have a description for this course yet.{' '}
              <a
                href={getEditDescriptionFormUrl(course)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-istBlue underline hover:no-underline"
              >
                Be the first to add one!
              </a>
            </p>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <EditableSection
          title="Evaluation method"
          value={course.evaluationMethod}
          editTooltip="Edit evaluation method"
          getEditUrl={() => getEvaluationMethodFormUrl(course)}
          renderContent={(value) => <Markdown>{value}</Markdown>}
          fallback={
            <p className="text-gray-600 italic">
              No evaluation method yet.{' '}
              <a
                href={getEvaluationMethodFormUrl(course)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-istBlue underline hover:no-underline"
              >
                Be the first to add one!
              </a>
            </p>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Student Reviews
          </h2>
          {course.feedbackCount > 0 && (
            <button
              onClick={() => {
                posthog.capture('review_form_open', {
                  source: 'course_detail_page.add_review',
                  course_id: course.id
                })
                navigate(reviewFormUrl)
              }}
              className="text-istBlue hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              Add your review!
            </button>
          )}
        </div>
        {feedback.length === 0 ? (
          <p className="text-gray-600">
            No reviews yet . Be the first to{' '}
            <button
              onClick={() => {
                posthog.capture('review_form_open', {
                  source: 'course_detail_page.add_first_review',
                  course_id: course.id
                })
                navigate(reviewFormUrl)
              }}
              className="text-istBlue hover:underline cursor-pointer"
            >
              add one
            </button>{' '}
            😁!
          </p>
        ) : (
          <div className="space-y-4">
            {Array.from(groupReviewsBySchoolYear(feedback).entries())
              .sort(([yearA], [yearB]) => yearB - yearA)
              .map(([schoolYear, yearFeedback], index, array) => {
                const isOutdated = isSchoolYearOutdated(schoolYear)
                const isFirstOutdated =
                  isOutdated &&
                  (index === 0 || !isSchoolYearOutdated(array[index - 1][0]))

                return (
                  <>
                    {isFirstOutdated && (
                      <WarningAlert message="The reviews below this point may be outdated. Course content, teaching methods, and requirements may have changed since then." />
                    )}
                    <SchoolYearSection
                      key={schoolYear}
                      schoolYear={formatSchoolYearString(schoolYear, {
                        yearFormat: 'long'
                      })}
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
  )
}
