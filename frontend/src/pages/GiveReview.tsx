import { Markdown, StarRating, WorkloadRating } from '@components'
import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
import { getCourses, submitFeedback } from '@services/meicFeedbackAPI'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Course } from '../services/meicFeedbackAPI'

export function GiveReview() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchParams] = useSearchParams()

  // Generate last 5 school years
  const schoolYears = Array.from(
    { length: 5 },
    (_, i) => getCurrentSchoolYear() - i
  )

  // Get initial values from search params
  const initialValues = getInitialValues(searchParams, schoolYears)

  console.log(initialValues)

  // Form fields
  const [email,            setEmail]            = useState<string>(initialValues.email ?? '') // prettier-ignore
  const [schoolYear,       setSchoolYear]       = useState<number>(initialValues.schoolYear ?? getCurrentSchoolYear()) // prettier-ignore
  const [selectedCourseId, setSelectedCourseId] = useState<number>(initialValues.courseId ?? 0) // prettier-ignore
  const [rating,           setRating]           = useState<number>(initialValues.rating ?? 0) // prettier-ignore
  const [workloadRating,   setWorkloadRating]   = useState<number>(initialValues.workloadRating ?? 0) // prettier-ignore
  const [comment,          setComment]          = useState<string>(initialValues.comment ?? '') // prettier-ignore

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses()
        setCourses(coursesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (
      initialValues.courseId &&
      courses.length > 0 &&
      !courses.some((c: Course) => c.id === initialValues.courseId)
    ) {
      setError('Selected course not found')
    }
  }, [initialValues.courseId, courses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedCourseId) {
      setError('Please select a course')
      return
    }

    if (!schoolYear) {
      setError('Please select a school year')
      return
    }

    if (!rating) {
      setError('Please select a rating')
      return
    }

    if (!email) {
      setError('Please enter your email')
      return
    }

    if (!workloadRating) {
      setError('Please select a workload rating')
      return
    }

    setIsSubmitting(true)

    try {
      await submitFeedback({
        email,
        schoolYear,
        courseId: selectedCourseId,
        rating,
        workloadRating,
        comment
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback')
    }

    setTimeout(() => {
      setIsSubmitting(false)
      // navigate(`/course/${selectedCourseId}`)
    }, 500)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        to="/"
        className="flex items-center text-istBlue hover:opacity-80 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to all courses</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Give a Review
          </h1>
          <Markdown>
            Thank you for taking the time to leave your review on a MEIC course!
            To ensure we have quality reviews on the website, we review every
            comment, one by one, before posting them.
          </Markdown>

          <Markdown>
            We ask for your email in case we need to get back to you regarding
            your feedback. **All comments will be kept anonymous forever!**
          </Markdown>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-istBlue focus:border-istBlue"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="schoolYear"
                className="block text-gray-700 font-medium mb-2"
              >
                School Year
              </label>
              <select
                id="schoolYear"
                value={schoolYear}
                onChange={(e) => setSchoolYear(Number(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-istBlue focus:border-istBlue"
              >
                {schoolYears.map((year) => (
                  <option key={year} value={year}>
                    {formatSchoolYearString(year, { yearFormat: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="course"
                className="block text-gray-700 font-medium mb-2"
              >
                Select Course
              </label>
              <select
                id="course"
                value={selectedCourseId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedCourseId(Number(e.target.value))
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-istBlue focus:border-istBlue"
              >
                <option value="">-- Select a course --</option>
                {courses.map((course: Course) => (
                  <option key={course.id} value={course.id}>
                    {course.acronym} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Overall Rating
              </label>
              <StarRating rating={rating} size="lg" setRating={setRating} />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Workload Rating
              </label>
              <WorkloadRating
                rating={workloadRating}
                onChange={setWorkloadRating}
              />
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Comments (optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-istBlue focus:border-istBlue"
                placeholder="Share your experience with this course..."
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-istBlue hover:bg-istBlue/90 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  )
}

function getRatingValue(searchValue: string | null) {
  if (!searchValue) return null
  const value = Number(searchValue)
  if (isNaN(value)) return undefined
  return 1 <= value && value <= 5 ? value : undefined
}

function getInitialValues(
  searchParams: URLSearchParams,
  schoolYears: number[]
) {
  const email = searchParams.get('email') || undefined
  const schoolYear = (() => {
    const year = Number(searchParams.get('schoolYear'))
    return schoolYears.includes(year) ? year : getCurrentSchoolYear()
  })()
  const courseId = Number(searchParams.get('courseId')) || 0
  const rating = getRatingValue(searchParams.get('rating'))
  const workloadRating = getRatingValue(searchParams.get('workloadRating'))
  const comment =
    decodeURIComponent(searchParams.get('comment') || '') || undefined

  return {
    email,
    schoolYear,
    courseId,
    rating,
    workloadRating,
    comment
  }
}
