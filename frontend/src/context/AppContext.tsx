import {
  Degree,
  getDegrees,
  getSpecializations,
  Specialization
} from '@services/meicFeedbackAPI'
import { useLocalStorage } from '@uidotdev/usehooks'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

export interface AppContextType {
  degrees: Degree[]
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
  const [degrees, setDegrees] = useState<Degree[]>([])
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedDegreeId, setSelectedDegreeId] = useLocalStorage<
    number | null
  >(STORAGE_KEYS.SELECTED_DEGREE_ID, null)

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

  const selectedDegree = useMemo(() => {
    return degrees.find((degree) => degree.id === selectedDegreeId) || null
  }, [degrees, selectedDegreeId])

  return (
    <AppContext.Provider
      value={{
        degrees,
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
