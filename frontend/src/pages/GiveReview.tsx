import {
  CourseCombobox,
  ReviewSubmittedMessage,
  StarRatingWithLabel
} from '@components'
import { formatSchoolYearString, getCurrentSchoolYear } from '@lib/schoolYear'
import { getCourses, submitFeedback } from '@services/meicFeedbackAPI'
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from '@ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@ui/tooltip'
import { motion } from 'framer-motion'
import { HelpCircle, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Course } from '../services/meicFeedbackAPI'

export function GiveReview() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchParams] = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  // Generate last 5 school years
  const schoolYears = Array.from(
    { length: 5 },
    (_, i) => getCurrentSchoolYear() - i
  )

  // Get initial values from search params
  const initialValues = getInitialValues(searchParams, schoolYears)

  // Form fields
  const [email,               setEmail]               = useState<string>(initialValues.email ?? '') // prettier-ignore
  const [schoolYear,          setSchoolYear]          = useState<number>(initialValues.schoolYear ?? getCurrentSchoolYear()) // prettier-ignore
  const [selectedCourseId,    setSelectedCourseId]    = useState<number>(initialValues.courseId ?? 0) // prettier-ignore
  const [rating,              setRating]              = useState<number>(0) // prettier-ignore
  const [hoverRating,         setHoverRating]         = useState<number | null>(null) // prettier-ignore
  const [workloadRating,      setWorkloadRating]      = useState<number>(initialValues.workloadRating ?? 0) // prettier-ignore
  const [hoverWorkloadRating, setHoverWorkloadRating] = useState<number | null>(null) // prettier-ignore
  const [comment,             setComment]             = useState<string>(initialValues.comment ?? '') // prettier-ignore

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch courses
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

  // Validate course selection
  useEffect(() => {
    if (
      selectedCourseId &&
      courses.length > 0 &&
      !courses.some((c: Course) => c.id === selectedCourseId)
    ) {
      setSelectedCourseId(0)
    }
  }, [selectedCourseId, courses])

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
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    }

    setIsSubmitting(false)
  }

  const resetForm = () => {
    // Intentionally not resetting email and school year
    // because most likely they will be the same

    setSelectedCourseId(0)
    setRating(0)
    setHoverRating(null)
    setWorkloadRating(0)
    setComment('')
  }

  const handleNewReview = () => {
    setIsSuccess(false)
    resetForm()
  }

  if (isSuccess) {
    return (
      <ReviewSubmittedMessage
        onNewReview={handleNewReview}
        onBackToCourses={() => navigate('/')}
      />
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Leave your Review
          </h1>
          {/* <Markdown>
            Thank you for taking the time to leave your review on a MEIC course!
            To ensure we have quality reviews on the website, we review every
            comment, one by one, before posting them.
          </Markdown> */}

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="email">Email</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label="Email info"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-sm">
                      We ask for your email in case we need to get back to you
                      regarding your review.
                      <br />
                      Every submission will be kept anonymous forever!
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="your.email@example.com"
                required
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-none w-36">
                {/* <Label htmlFor="schoolYear">School Year</Label> */}
                <Select
                  value={schoolYear.toString()}
                  onValueChange={(val: string) => setSchoolYear(Number(val))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="schoolYear">
                    <SelectValue placeholder="Select a school year" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {formatSchoolYearString(year, { yearFormat: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                {/* <Label htmlFor="course">Select Course</Label> */}
                <CourseCombobox
                  courses={courses}
                  value={selectedCourseId || undefined}
                  onChange={setSelectedCourseId}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label>Overall Rating</Label>
              <StarRatingWithLabel
                value={rating}
                hoverValue={hoverRating}
                onChange={setRating}
                onHover={setHoverRating}
                size="lg"
              />
            </div>

            <div>
              <Label>Workload Rating</Label>
              <StarRatingWithLabel
                value={workloadRating}
                hoverValue={hoverWorkloadRating}
                onChange={setWorkloadRating}
                onHover={setHoverWorkloadRating}
                size="lg"
                labels={[
                  'No work-life balance possible',
                  'Difficult to balance with other courses',
                  'Balanced with other commitments',
                  'Easy to balance with other courses',
                  'Barely impacted my schedule'
                ]}
              />
            </div>

            <div>
              <Label htmlFor="comment">Your Comments (optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setComment(e.target.value)
                }
                placeholder="Share your experience with this course..."
                disabled={isSubmitting}
                rows={5}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit</span>
                </>
              )}
            </Button>
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
