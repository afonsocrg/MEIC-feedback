import { useApp } from '@/hooks'
import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Header() {
  const { selectedDegree, setIsDegreeSelectorOpen } = useApp()
  return (
    <header className="bg-istBlue text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-medium hover:opacity-80 transition-opacity"
        >
          <GraduationCap className="h-6 w-6" />
          <span>{selectedDegree?.acronym ?? 'IST'} Feedback</span>
        </Link>
        <button
          className="text-white hover:text-gray-200 transition-colors cursor-pointer"
          onClick={() => setIsDegreeSelectorOpen(true)}
        >
          Change degree
        </button>
      </div>
    </header>
  )
}
