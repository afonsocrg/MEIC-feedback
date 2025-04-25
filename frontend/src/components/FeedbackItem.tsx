import React from 'react'
import { Feedback } from '../types'
import StarRating from './StarRating'

interface FeedbackItemProps {
  feedback: Feedback
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback }) => {
  const formattedDate = new Date(feedback.createdAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  )

  return (
    <div className="py-6 first:pt-0">
      <div className="flex items-center gap-3 mb-3">
        <StarRating rating={feedback.rating} size="sm" />
        <span className="text-gray-500 text-sm">{formattedDate}</span>
      </div>
      <p className="text-gray-700 whitespace-pre-line">{feedback.comment}</p>
      <div className="mt-6 border-b border-gray-100 last:border-0" />
    </div>
  )
}

export default FeedbackItem
