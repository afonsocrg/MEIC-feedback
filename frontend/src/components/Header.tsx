import { GraduationCap } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="bg-istBlue text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-medium hover:opacity-80 transition-opacity"
        >
          <GraduationCap className="h-6 w-6" />
          <span>MEIC Feedback</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* <Link
            // to="/feedback/new"
            to="https://docs.google.com/forms/d/e/1FAIpQLSe3ptJwi8uyQfXI8DUmi03dwRL0m7GJa1bMU_6mJpobmXl8NQ/viewform?usp=dialog"
            target="_blank"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Give Feedback</span>
          </Link> */}

          {/* <a
            href="https://github.com/afonsocrg/MEIC-feedback"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5" />
          </a> */}
        </div>
      </div>
    </header>
  )
}

export default Header
