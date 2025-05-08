import { FeedbackItem } from '@components'
import { Feedback } from '@services/meicFeedbackAPI'

interface SchoolYearSectionProps {
  schoolYear: string
  feedback: Feedback[]
  variants: {
    hidden: { opacity: number; y: number }
    visible: {
      opacity: number
      y: number
      transition: { type: string; stiffness: number }
    }
  }
}

export function SchoolYearSection({
  schoolYear,
  feedback,
  variants
}: SchoolYearSectionProps) {
  return (
    <div>
      <div className="text-lg font-semibold text-gray-700 mb-4">
        {schoolYear}
      </div>
      {feedback.map((f) => (
        <FeedbackItem key={f.id} feedback={f} variants={variants} />
      ))}
    </div>
  )
}
