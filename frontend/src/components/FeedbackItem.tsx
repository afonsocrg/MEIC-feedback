import { motion } from 'framer-motion'
import React from 'react'
import { Feedback } from '../services/meicFeedbackAPI'
import Markdown from './Markdown'
import StarRating from './StarRating'

interface FeedbackItemProps {
  feedback: Feedback
  variants?: {
    hidden: { opacity: number; y: number }
    visible: {
      opacity: number
      y: number
      transition: { type: string; stiffness: number }
    }
  }
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, variants }) => {
  return (
    <motion.div
      variants={variants}
      className="bg-white rounded-lg shadow-md p-6 mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <StarRating rating={feedback.rating} />
          <span className="text-gray-500 text-sm ml-4">
            {new Date(feedback.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      {feedback.comment && <Markdown>{feedback.comment}</Markdown>}
    </motion.div>
  )
}

export default FeedbackItem
