import {
  Course,
  getCourses,
  MeicFeedbackAPIError,
  submitFeedback
} from '@/services/meicFeedbackAPI'
import {
  GiveReviewForm1,
  GiveReviewForm2,
  GiveReviewForm3,
  GiveReviewForm4,
  ReviewSubmitSuccess
} from '@components'
import { zodResolver } from '@hookform/resolvers/zod'
import { getCurrentSchoolYear } from '@lib/schoolYear'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  schoolYear: z.number().min(2020).max(3050),
  courseId: z.number(),
  rating: z.number().min(0).max(5),
  workloadRating: z.number().min(0).max(5),
  comment: z.string().min(0).max(1000).optional()
})

const FEEDBACK_EMAIL_STORAGE_KEY = 'lastFeedbackEmail'

export type GiveReviewFormValues = z.infer<typeof formSchema>

export function GiveReview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState<Course[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const formVersion = searchParams.get('version') || '4'

  const schoolYears = useMemo(
    () => Array.from({ length: 5 }, (_, i) => getCurrentSchoolYear() - i),
    []
  )

  const initialValues = getInitialValues(searchParams, schoolYears)
  const form = useForm<GiveReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialValues.email,
      schoolYear: initialValues.schoolYear,
      courseId: initialValues.courseId,
      rating: initialValues.rating,
      workloadRating: initialValues.workloadRating,
      comment: initialValues.comment
    }
  })
  const selectedCourse = form.watch('courseId')

  async function onSubmit(values: GiveReviewFormValues) {
    // Store email in local storage for next time
    localStorage.setItem(FEEDBACK_EMAIL_STORAGE_KEY, values.email)

    // Check if courseId is a valid course
    if (!courses.some((c) => c.id === values.courseId)) {
      form.setError('courseId', {
        message: 'Please select a valid course'
      })
      return
    }

    setIsSubmitting(true)
    try {
      await submitFeedback(values)
      setIsSuccess(true)
      toast.success('Feedback submitted successfully')
    } catch (err) {
      if (err instanceof MeicFeedbackAPIError) {
        toast.error(err.message)
      } else {
        console.error(err)
        toast.error('Failed to submit feedback')
      }
    }

    setIsSubmitting(false)
  }

  // Fetch courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses()
        setCourses(coursesData)
      } catch (err) {
        if (err instanceof MeicFeedbackAPIError) {
          toast.error(err.message)
        } else {
          console.error(err)
          toast.error('Failed to load data')
        }
      }
    }

    fetchData()
  }, [])

  // Validate course selection
  useEffect(() => {
    if (
      selectedCourse &&
      courses.length > 0 &&
      !courses.some((c: Course) => c.id === selectedCourse)
    ) {
      form.setValue('courseId', 0)
    }
  }, [form, courses, selectedCourse])

  if (isSuccess) {
    return (
      <ReviewSubmitSuccess
        onNewReview={() => {
          setIsSuccess(false)
          form.reset()
        }}
        onBackToCourses={() => navigate('/')}
      />
    )
  }

  const props = { form, courses, schoolYears, isSubmitting, onSubmit }

  switch (formVersion) {
    case '1':
      return <GiveReviewForm1 {...props} />
    case '2':
      return <GiveReviewForm2 {...props} />
    case '3':
      return <GiveReviewForm3 {...props} />
    case '4':
    default:
      return <GiveReviewForm4 {...props} />
  }
}

function getRatingValue(searchValue: string | null) {
  if (!searchValue) return undefined
  const value = Number(searchValue)
  if (isNaN(value)) return undefined
  return 1 <= value && value <= 5 ? value : undefined
}

function getInitialValues(
  searchParams: URLSearchParams,
  schoolYears: number[]
) {
  const email =
    searchParams.get('email') ||
    localStorage.getItem(FEEDBACK_EMAIL_STORAGE_KEY) ||
    ''
  const schoolYear = (() => {
    const year = Number(searchParams.get('schoolYear'))
    return schoolYears.includes(year) ? year : getCurrentSchoolYear()
  })()
  const courseId = Number(searchParams.get('courseId')) || 0
  const rating = getRatingValue(searchParams.get('rating'))
  const workloadRating = getRatingValue(searchParams.get('workloadRating'))
  const comment = decodeURIComponent(searchParams.get('comment') || '')

  return {
    email,
    schoolYear,
    courseId,
    rating,
    workloadRating,
    comment
  }
}
