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
      {feedback.comment && (
        <Markdown
          components={{
            h1: ({ ...props }) => (
              <h1
                {...props}
                className="text-xl font-semibold text-gray-900 mt-4 mb-3"
              />
            ),
            h2: ({ ...props }) => (
              <h2
                {...props}
                className="text-lg font-semibold text-gray-900 mt-3 mb-2"
              />
            ),
            h3: ({ ...props }) => (
              <h3
                {...props}
                className="text-lg font-semibold text-gray-900 mt-2 mb-1"
              />
            )
          }}
        >
          {feedback.comment}
        </Markdown>
      )}
    </motion.div>
  )
}

export default FeedbackItem
