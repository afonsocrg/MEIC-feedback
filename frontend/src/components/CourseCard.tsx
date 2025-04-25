import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'
import { Course } from '../services/meicFeedbackAPI'
import StarRating from './StarRating'

interface CourseCardProps extends Omit<Course, 'id'> {
  courseId: number
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseId,
  acronym,
  name,
  rating,
  feedbackCount
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
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <Link
        to={`/courses/${acronym}`}
        state={{ courseId }}
        className="block h-full"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{name}</h2>
        <p className="text-gray-600 mb-4">{acronym}</p>
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
          {/* <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#009de0] hover:text-[#007bb5] transition-colors"
          >
            View Details
          </a> */}
        </div>
      </Link>
    </motion.div>
  )
}

export default CourseCard
