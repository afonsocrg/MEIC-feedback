import { Chip, StarRating } from '@components'
import { Course } from '@services/meicFeedbackAPI'
import { Button } from '@ui'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface CourseCardProps extends Omit<Course, 'id'> {
  courseId: number
  useAcronymAsTitle?: boolean
}

export function CourseCard({
  courseId,
  acronym,
  name,
  rating,
  feedbackCount,
  terms,
  useAcronymAsTitle = false
}: CourseCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300 }
    }
  }

  const title = useAcronymAsTitle ? acronym : name
  const desc = useAcronymAsTitle ? name : acronym

  return (
    <motion.div
      key={courseId}
      variants={itemVariants}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full cursor-pointer"
    >
      <Link
        to={`/courses/${courseId}`}
        className="h-full flex flex-col justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-gray-600">{desc}</p>
            <div className="flex items-center gap-2">
              {/* {feedbackCount === 0 && <Chip label="New!" />} */}
              {terms && (
                <>
                  {terms.map((t) => (
                    <Chip key={t} label={t} />
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {feedbackCount > 0 ? (
                <>
                  <div className="mr-2">
                    <StarRating value={rating} size="sm" />
                  </div>
                  <span className="text-gray-700">{rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-2">
                    ({feedbackCount} reviews)
                  </span>
                </>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(`/feedback/new?courseId=${courseId}`, '_blank')
                  }}
                  variant="link"
                >
                  Give the first review!
                </Button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
