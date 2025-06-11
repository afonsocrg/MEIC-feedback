import {
  MeicFeedbackAPIError,
  submitFeedback
} from '@/services/meicFeedbackAPI'
import {
  GiveReviewForm1,
  GiveReviewForm2,
  GiveReviewForm3,
  GiveReviewForm4,
  // GiveReviewForm5,
  GiveReviewForm6,
  GiveReviewProps,
  ReviewSubmitSuccess
} from '@components'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApp, useDegreeCourses } from '@hooks'
import { getCurrentSchoolYear } from '@lib/schoolYear'
import { getCourse } from '@services/meicFeedbackAPI'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (email) =>
        email.endsWith('@tecnico.ulisboa.pt') || email.endsWith('@ist.utl.pt'),
      'Please enter a valid IST email address'
    ),
  schoolYear: z.number().min(2020).max(3050),
  courseId: z.number(),
  rating: z.number().min(0).max(5),
  workloadRating: z.number().min(0).max(5),
  comment: z.string().min(0).max(1000).optional()
})

const FEEDBACK_EMAIL_STORAGE_KEY = 'lastFeedbackEmail'
const FEEDBACK_DEGREE_ID_STORAGE_KEY = 'lastFeedbackDegreeId'

export type GiveReviewFormValues = z.infer<typeof formSchema>

export function GiveReview() {
  const navigate = useNavigate()
  const { selectedDegreeId, selectedDegree: contextDegree } = useApp()

  const [searchParams] = useSearchParams()
  const schoolYears = useMemo(
    () => Array.from({ length: 5 }, (_, i) => getCurrentSchoolYear() - i),
    []
  )
  const initialValues = useMemo(
    () => getInitialValues(searchParams, schoolYears),
    [searchParams, schoolYears]
  )

  // By default, the available courses are the ones from the currently selected degree
  // If the URL specifies a courseId and that course does not exist in the set of selected courses
  // then we want to load all the courses from that degree.
  // If there is no degree selected (1), we set the degree of the selected course as the selected degree
  // (1) WARNING: we have to check if there is no degree selected using the selectedDegreeId
  // property, because when the page is loading, we may have a selected degree, but not a
  // degree object yet!!
  const [localDegreeId, setLocalDegreeId] = useState<number | null>(
    selectedDegreeId ||
      Number(localStorage.getItem(FEEDBACK_DEGREE_ID_STORAGE_KEY)) ||
      null
  )

  const { data: localCourses } = useDegreeCourses(localDegreeId)

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const formVersion = searchParams.get('version')
  const selectedCourseId = form.watch('courseId')
  const selectedCourse = useMemo(
    () => localCourses?.find((c) => c.id === selectedCourseId) ?? null,
    [selectedCourseId, localCourses]
  )

  const appliedSearchCourseId = useRef(false)
  useEffect(() => {
    if (
      appliedSearchCourseId.current ||
      !initialValues.courseId ||
      (localCourses &&
        localCourses.find((c) => c.id === initialValues.courseId))
    ) {
      return
    } else {
      appliedSearchCourseId.current = true
      ;(async () => {
        console.log('Loading course details...')
        const courseDetails = await getCourse(initialValues.courseId)
        setLocalDegreeId(courseDetails.degreeId)
      })()
    }
  }, [initialValues.courseId, localCourses])

  async function onSubmit(values: GiveReviewFormValues) {
    // Store email and degree id in local storage for next time
    localStorage.setItem(FEEDBACK_EMAIL_STORAGE_KEY, values.email)
    if (localDegreeId) {
      localStorage.setItem(
        FEEDBACK_DEGREE_ID_STORAGE_KEY,
        localDegreeId.toString()
      )
    } else {
      console.error('No local degree id')
    }

    // Check if courseId is a valid course
    if (!localCourses || !localCourses.some((c) => c.id === values.courseId)) {
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

  if (isSuccess) {
    return (
      <ReviewSubmitSuccess
        selectedCourse={selectedCourse}
        onNewReview={() => {
          setIsSuccess(false)
          form.reset()
        }}
        onBackToCourses={() => navigate('/')}
      />
    )
  }

  return (
    <>
      <GiveReviewForm
        {...{
          version: formVersion,
          form,
          courses: localCourses ?? [],
          schoolYears,
          isSubmitting,
          onSubmit,
          localDegreeId,
          setLocalDegreeId,
          contextDegree
        }}
      />
    </>
  )
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

interface GiveReviewFormProps extends GiveReviewProps {
  version: string | null
}
function GiveReviewForm({ version, ...props }: GiveReviewFormProps) {
  switch (version) {
    case '1':
      return <GiveReviewForm1 {...props} />
    case '2':
      return <GiveReviewForm2 {...props} />
    case '3':
      return <GiveReviewForm3 {...props} />
    case '4':
      return <GiveReviewForm4 {...props} />
    // case '5':
    //   return <GiveReviewForm5 {...props} />
    case '6':
    default:
      return <GiveReviewForm6 {...props} />
  }
}
