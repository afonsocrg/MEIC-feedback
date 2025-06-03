import { SchoolYearSection, WarningAlert } from '@components'
import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
import { type CourseDetail, type Feedback } from '@services/meicFeedbackAPI'
import posthog from 'posthog-js'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300 }
  }
}

function isSchoolYearOutdated(schoolYear: number) {
  const currentSchoolYear = getCurrentSchoolYear()

  // A school year is outdated if it's more than 2 years behind the current one
  return schoolYear < currentSchoolYear - 2
}

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

export interface CourseReviewsProps {
  course: CourseDetail
  feedback: Feedback[]
}
export function CourseReviews({ course, feedback }: CourseReviewsProps) {
  const navigate = useNavigate()
  const reviewFormUrl = useMemo(
    () => `/feedback/new${course ? `?courseId=${course.id}` : ''}`,
    [course]
  )
  return (
    <>
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
    </>
  )
}
