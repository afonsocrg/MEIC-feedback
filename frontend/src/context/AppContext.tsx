import {
  type Course,
  type Degree,
  getCourses,
  getDegrees,
  getSpecializations,
  Specialization
} from '@services/meicFeedbackAPI'
import { useLocalStorage } from '@uidotdev/usehooks'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

export interface AppContextType {
  degrees: Degree[]
  courses: Course[]
  specializations: Specialization[]
  selectedDegree: Degree | null
  setSelectedDegreeId: (degreeId: number | null) => void
  isLoading: boolean
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

const STORAGE_KEYS = {
  SELECTED_DEGREE_ID: 'selectedDegreeId'
}

export function AppProvider({ children }: AppProviderProps) {
  const [isLoading, setIsLoading] = useState(true)

  const [degrees, setDegrees] = useState<Degree[]>([])
  const [selectedDegreeId, setSelectedDegreeId] = useLocalStorage<
    number | null
  >(STORAGE_KEYS.SELECTED_DEGREE_ID, null)
  const selectedDegree = useMemo(() => {
    return degrees.find((degree) => degree.id === selectedDegreeId) || null
  }, [degrees, selectedDegreeId])

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const [degreesData, specializationsData] = await Promise.all([
          getDegrees(),
          getSpecializations()
        ])
        setDegrees(degreesData)
        setSpecializations(specializationsData)
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDegrees()
  }, [])

  const [specializations, setSpecializations] = useState<Specialization[]>([])

  const [courses, setCourses] = useState<Course[]>([])
  useEffect(() => {
    const fetchCourses = async () => {
      if (degrees.length === 0 || selectedDegreeId === null) {
        return []
      }

      const coursesData = await getCourses({
        degreeId: selectedDegreeId
      })

      console.log('coursesData', coursesData)
      setCourses(coursesData)
    }
    fetchCourses()
  }, [degrees, selectedDegreeId])

  return (
    <AppContext.Provider
      value={{
        degrees,
        courses,
        specializations,
        selectedDegree,
        setSelectedDegreeId,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
