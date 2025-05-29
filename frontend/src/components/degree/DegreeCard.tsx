import { Degree } from '@services/meicFeedbackAPI'
import { motion } from 'framer-motion'

interface DegreeCardProps {
  degree: Degree
  onClick: () => void
}

export function DegreeCard({ degree, onClick }: DegreeCardProps) {
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
      variants={itemVariants}
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {degree.name}
        </h2>
        <p className="text-gray-600">{degree.acronym}</p>
      </div>
    </motion.div>
  )
}
