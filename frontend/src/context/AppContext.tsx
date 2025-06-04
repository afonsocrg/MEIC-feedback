import { DegreeSelector } from '@/components'
import {
  type Course,
  type CourseGroup,
  type Degree,
  getCourseGroups,
  getCourses,
  getDegrees
} from '@services/meicFeedbackAPI'
import { useLocalStorage } from '@uidotdev/usehooks'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface AppContextType {
  degrees: Degree[]
  courses: Course[]
  courseGroups: CourseGroup[]
  selectedDegree: Degree | null
  setSelectedDegreeId: (degreeId: number | null) => void
  isDegreeSelectorOpen: boolean
  setIsDegreeSelectorOpen: (isOpen: boolean) => void
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
  const [searchParams] = useSearchParams()

  const [degrees, setDegrees] = useState<Degree[]>([])
  const [selectedDegreeId, setSelectedDegreeId] = useLocalStorage<
    number | null
  >(STORAGE_KEYS.SELECTED_DEGREE_ID, null)
  const [isDegreeSelectorOpen, setIsDegreeSelectorOpen] = useState(false)
  const selectedDegree = useMemo(() => {
    return degrees.find((degree) => degree.id === selectedDegreeId) || null
  }, [degrees, selectedDegreeId])

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const degreesData = await getDegrees()
        setDegrees(degreesData)

        // Check for degree parameter in URL
        const degreeAcronym = searchParams.get('degree')
        if (degreeAcronym) {
          const matchingDegree = degreesData.find(
            (degree) =>
              degree.acronym.toLowerCase() === degreeAcronym.toLowerCase()
          )
          if (matchingDegree) {
            setSelectedDegreeId(matchingDegree.id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDegrees()
  }, [searchParams, setSelectedDegreeId])

  // Update page title based on selected degree
  useEffect(() => {
    document.title = selectedDegree
      ? `${selectedDegree.acronym} Feedback`
      : 'IST Feedback'
  }, [selectedDegree])

  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  useEffect(() => {
    const fetchCourses = async () => {
      if (degrees.length === 0 || selectedDegreeId === null) {
        return
      }

      const [coursesData, courseGroupsData] = await Promise.all([
        getCourses({ degreeId: selectedDegreeId }),
        getCourseGroups(selectedDegreeId)
      ])

      setCourses(coursesData)
      setCourseGroups(courseGroupsData)
    }
    fetchCourses()
  }, [degrees, selectedDegreeId])

  return (
    <AppContext.Provider
      value={{
        degrees,
        courses,
        courseGroups,
        selectedDegree,
        setSelectedDegreeId,
        isDegreeSelectorOpen,
        setIsDegreeSelectorOpen,
        isLoading
      }}
    >
      <DegreeSelector
        isOpen={!isLoading && (isDegreeSelectorOpen || selectedDegree === null)}
        onClose={() => setIsDegreeSelectorOpen(false)}
      />
      {children}
    </AppContext.Provider>
  )
}
