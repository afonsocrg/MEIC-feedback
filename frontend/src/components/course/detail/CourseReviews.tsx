import { askForFeedbackUrl } from '@/utils/whatsapp'
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
    () => `/feedback/new${course.id ? `?courseId=${course.id}` : ''}`,
    [course.id]
  )
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Student Reviews
        </h2>
        {course.feedbackCount > 0 && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                askForFeedbackUrl(course)
                // window.open(askForFeedbackUrl(course), '_blank')
                // posthog.capture('share_course_whatsapp', {
                //   course_id: course.id,
                //   course_acronym: course.acronym
                // })
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium cursor-pointer flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Ask a friend
            </button>
            <button
              onClick={() => {
                posthog.capture('review_form_open', {
                  source: 'course_detail_page.add_review',
                  course_id: course.id
                })
                navigate(reviewFormUrl)
              }}
              className="bg-istBlue text-white px-4 py-2 rounded-md hover:bg-istBlue/80 transition-colors duration-200 font-medium cursor-pointer"
            >
              Give Feedback!
            </button>
          </div>
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
            className="bg-istBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
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
