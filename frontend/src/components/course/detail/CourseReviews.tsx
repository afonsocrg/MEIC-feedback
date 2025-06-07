import { SchoolYearSection, WarningAlert } from '@components'
import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
import { type CourseDetail, type Feedback } from '@services/meicFeedbackAPI'
import { Button } from '@ui/button'
import posthog from 'posthog-js'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AskForFeedback } from './AskForFeedback'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300 }
  }
}

export interface CourseReviewsProps {
  course: CourseDetail
  feedback: Feedback[]
}
export function CourseReviews({ course, feedback }: CourseReviewsProps) {
  const navigate = useNavigate()
  const reviewFormUrl = useMemo(
    () => `/feedback/new${course.id ? `?courseId=${course.id}` : ''}`,
    [course.id]
  )

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Student Reviews
        </h2>
        {course.feedbackCount > 0 && (
          <div className="flex gap-3">
            <AskForFeedback reviewFormUrl={reviewFormUrl} course={course} />
            <Button
              onClick={() => {
                posthog.capture('review_form_open', {
                  source: 'course_detail_page.add_review',
                  course_id: course.id
                })
                navigate(reviewFormUrl)
              }}
            >
              Give Feedback!
            </Button>
          </div>
        )}
      </div>
      {feedback.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-6 bg-gray-50 rounded-lg">
          <div className="text-5xl">💬</div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              No reviews yet for this course
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Be the first to share your experience, or invite your friends to
              leave feedback! Your input helps future students make better
              choices.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <AskForFeedback reviewFormUrl={reviewFormUrl} course={course} />
            <Button
              onClick={() => {
                posthog.capture('review_form_open', {
                  source: 'course_detail_page.add_first_review',
                  course_id: course.id
                })
                navigate(reviewFormUrl)
              }}
            >
              Give Feedback!
            </Button>
          </div>
        </div>
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
                <div key={schoolYear}>
                  {isFirstOutdated && (
                    <WarningAlert message="The reviews below this point may be outdated. Course content, teaching methods, and requirements may have changed since then." />
                  )}
                  <SchoolYearSection
                    schoolYear={formatSchoolYearString(schoolYear, {
                      yearFormat: 'long'
                    })}
                    feedback={yearFeedback}
                    variants={itemVariants}
                  />
                </div>
              )
            })}
        </div>
      )}
    </>
  )
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
