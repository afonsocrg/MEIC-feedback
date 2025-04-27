import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <motion.main
        className="container mx-auto px-4 py-8 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="text-center">
          <h1 className="text-6xl font-bold text-istBlue mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-istBlue text-white rounded-lg hover:bg-istBlue/90 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Go back home</span>
          </button>
        </div>
      </motion.main>
    </div>
  )
}
