import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'
import { Course } from '../services/meicFeedbackAPI'
import Chip from './Chip'
import StarRating from './StarRating'

interface CourseCardProps extends Omit<Course, 'id'> {
  courseId: number
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseId,
  acronym,
  name,
  rating,
  feedbackCount,
  period
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300 }
    }
  }

  return (
    <motion.div
      key={courseId}
      variants={itemVariants}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full"
    >
      <Link
        to={`/courses/${acronym}`}
        state={{ courseId }}
        className="h-full flex flex-col justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{name}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-gray-600">{acronym}</p>
            {period && <Chip label={period} />}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2">
                <StarRating rating={rating} size="sm" />
              </div>
              <span className="text-gray-700">{rating.toFixed(1)}</span>
              <span className="text-gray-500 ml-2">
                ({feedbackCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CourseCard
