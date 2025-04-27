import React from 'react'
import { Feedback } from '../services/meicFeedbackAPI'
import FeedbackItem from './FeedbackItem'

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

const SchoolYearSection: React.FC<SchoolYearSectionProps> = ({
  schoolYear,
  feedback,
  variants
}) => {
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

export default SchoolYearSection
