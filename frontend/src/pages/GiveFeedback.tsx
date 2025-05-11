import { Markdown, StarRating, WorkloadRating } from '@components'
import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
import { getCourses, submitFeedback } from '@services/meicFeedbackAPI'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Course } from '../services/meicFeedbackAPI'

export function GiveFeedback() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchParams] = useSearchParams()
  // const initialCourseId = parseInt(searchParams.get('courseId')) || null
  const initialCourseId = 0

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [schoolYear, setSchoolYear] = useState(getCurrentSchoolYear())
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId)
  const [rating, setRating] = useState(3)
  const [workloadRating, setWorkloadRating] = useState(3)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Generate last 5 school years
  const schoolYears = Array.from(
    { length: 5 },
    (_, i) => getCurrentSchoolYear() - i
  )

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
      initialCourseId &&
      !courses.some((c: Course) => c.id === initialCourseId)
    ) {
      setError('Selected course not found')
    }
  }, [initialCourseId, courses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedCourseId) {
      setError('Please select a course')
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
            Thank you for taking the time to provide feedback on a MEIC course!
            To ensure we have quality feedback on the website, we review every
            comment, one by one, before posting them. We ask for your email in
            case we need to get back to you regarding your feedback. **All
            comments will be kept anonymous forever!**
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
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-istBlue focus:border-istBlue"
                disabled={!!initialCourseId || isSubmitting}
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
