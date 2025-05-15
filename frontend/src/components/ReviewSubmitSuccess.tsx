import { motion } from 'framer-motion'
import { CheckCircle, Home, PlusCircle } from 'lucide-react'

interface ReviewSubmitSuccessProps {
  onNewReview: () => void
  onBackToCourses: () => void
}

export function ReviewSubmitSuccess({
  onNewReview,
  onBackToCourses
}: ReviewSubmitSuccessProps) {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-12 max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Feedback Submitted!
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for helping improve MEIC courses! Your review will be
          published soon.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onNewReview}
            className="flex items-center gap-2 px-4 py-2 bg-istBlue hover:bg-istBlue/90 text-white rounded-lg transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Submit Another Review
          </button>
          <button
            onClick={onBackToCourses}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to all courses
          </button>
        </div>
      </motion.div>
    </main>
  )
}
