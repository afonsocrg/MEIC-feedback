import { Course } from '@/services/meicFeedbackAPI'
import { GiveReviewFormValues } from '@pages'
import { UseFormReturn } from 'react-hook-form'

export interface GiveReviewProps {
  form: UseFormReturn<GiveReviewFormValues>
  courses: Course[]
  schoolYears: number[]
  isSubmitting: boolean
  onSubmit: (values: GiveReviewFormValues) => Promise<void>
}
