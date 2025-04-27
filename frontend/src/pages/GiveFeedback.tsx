import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import StarRating from '../components/StarRating'
import { useApp } from '../context/AppContext'

const GiveFeedback: React.FC = () => {
  const { courses, addFeedback } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialCourseId = searchParams.get('courseId') || ''

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId)
  const [rating, setRating] = useState(3)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialCourseId && !courses.some((c) => c.id === initialCourseId)) {
      setError('Selected course not found')
    }
  }, [initialCourseId, courses])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedCourseId) {
      setError('Please select a course')
      return
    }

    if (!comment.trim()) {
      setError('Please enter a comment')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      addFeedback({
        courseId: selectedCourseId,
        rating,
        comment
      })

      setIsSubmitting(false)
      navigate(`/course/${selectedCourseId}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

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
              Give Feedback
            </h1>
            <p className="text-gray-600 mb-8">
              Share your experience to help other students
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.acronym}: {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Rating
                </label>
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive
                  onChange={setRating}
                />
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Comments
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-istBlue focus:border-istBlue"
                  placeholder="Share your experience with this course..."
                  disabled={isSubmitting}
                  required
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
    </div>
  )
}

export default GiveFeedback
