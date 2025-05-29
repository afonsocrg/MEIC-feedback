import { useApp } from '@/hooks'
import { getCourseIdFromAcronym } from '@services/meicFeedbackAPI'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function ShortcutRedirect() {
  const navigate = useNavigate()

  const { degree: degreeAcronym, course: courseAcronym } = useParams()
  const { isLoading, degrees, courses } = useApp()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const redirectToCourse = async () => {
      if (isLoading) return

      const degree = degrees.find(
        (d) => d.acronym.toLowerCase() === degreeAcronym?.toLowerCase()
      )

      if (!degree) {
        setError(`Degree ${degreeAcronym} not found`)
        return
      }

      if (!courseAcronym) {
        setError('Course acronym not found')
        return
      }

      try {
        // Here you would typically validate the university and degree first
        // For now, we'll just get the course ID
        const courseId = await getCourseIdFromAcronym(degree.id, courseAcronym!)
        navigate(`/courses/${courseId}`, { replace: true })
      } catch (err) {
        console.error(err)
        setError('Course not found')
      }
    }

    redirectToCourse()
  }, [isLoading, degrees, courses, degreeAcronym, courseAcronym, navigate])

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
      </div>
    </div>
  )
}
