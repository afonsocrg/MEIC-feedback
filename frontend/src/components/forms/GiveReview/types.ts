import { Course, Degree } from '@/services/meicFeedbackAPI'
import { GiveReviewFormValues } from '@pages'
import { UseFormReturn } from 'react-hook-form'

export interface GiveReviewProps {
  form: UseFormReturn<GiveReviewFormValues>
  courses: Course[]
  schoolYears: number[]
  isSubmitting: boolean
  onSubmit: (values: GiveReviewFormValues) => Promise<void>
  localDegree: Degree | null
  contextDegree: Degree | null
}
