import {
  type Course,
  type Degree,
  getCourse,
  getCourses,
  MeicFeedbackAPIError,
  submitFeedback
} from '@/services/meicFeedbackAPI'
import {
  GiveReviewForm1,
  GiveReviewForm2,
  GiveReviewForm3,
  GiveReviewForm4,
  GiveReviewForm5,
  GiveReviewProps,
  ReviewSubmitSuccess
} from '@components'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApp } from '@hooks'
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
  const {
    courses: contextCourses,
    selectedDegreeId,
    selectedDegree: contextDegree,
    setSelectedDegreeId
  } = useApp()

  const [searchParams] = useSearchParams()
  const schoolYears = useMemo(
    () => Array.from({ length: 5 }, (_, i) => getCurrentSchoolYear() - i),
    []
  )
  const initialValues = useMemo(
    () => getInitialValues(searchParams, schoolYears),
    [searchParams, schoolYears]
  )

  const [localDegree, setLocalDegree] = useState<Degree | null>(contextDegree)

  // By default, the available courses are the ones from the currently selected degree
  // If the URL specifies a courseId and that course does not exist in the set of selected courses
  // then we want to load all the courses from that degree.
  // If there is no degree selected (1), we set the degree of the selected course as the selected degree
  // (1) WARNING: we have to check if there is no degree selected using the selectedDegreeId
  // property, because when the page is loading, we may have a selected degree, but not a
  // degree object yet!!
  const [courses, setCourses] = useState<Course[]>(contextCourses)
  useEffect(() => {
    const loadCourses = async () => {
      if (
        initialValues.courseId > 0 &&
        !contextCourses?.find((c) => c.id === initialValues.courseId)
      ) {
        const courseDetails = await getCourse(initialValues.courseId)
        if (selectedDegreeId === null) {
          setSelectedDegreeId(courseDetails.degreeId)
        } else {
          getCourses({
            degreeId: courseDetails.degreeId
          }).then((degreeCourses) => {
            setCourses(degreeCourses)
          })
          if (courseDetails.degreeId !== localDegree?.id) {
            setLocalDegree(courseDetails.degree)
          }
        }
      } else {
        setCourses(contextCourses)
      }
    }
    loadCourses()
  }, [
    initialValues.courseId,
    contextCourses,
    selectedDegreeId,
    setSelectedDegreeId,
    setLocalDegree,
    localDegree
  ])

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
  const [isSuccess, setIsSuccess] = useState(true)

  const formVersion = searchParams.get('version')
  const selectedCourseId = form.watch('courseId')
  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) ?? null,
    [selectedCourseId, courses]
  )

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

  // Validate course selection
  useEffect(() => {
    if (
      selectedCourse &&
      courses.length > 0 &&
      !courses.some((c: Course) => c.id === selectedCourseId)
    ) {
      form.setValue('courseId', 0)
    }
  }, [form, courses, selectedCourseId])

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
        version={formVersion}
        {...{
          form,
          courses,
          schoolYears,
          isSubmitting,
          onSubmit,
          localDegree,
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
    case '5':
    default:
      return <GiveReviewForm5 {...props} />
  }
}
