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

  const [selectedDegreeId, setSelectedDegreeId] = useLocalStorage<
    number | null
  >(STORAGE_KEYS.SELECTED_DEGREE_ID, null)

  useEffect(() => {
    const fetchDegrees = async () => {
      const [degreesData, specializationsData] = await Promise.all([
        getDegrees(),
        getSpecializations()
      ])
      setDegrees(degreesData)
      setSpecializations(specializationsData)
    }
    fetchDegrees()
  }, [])

  console.log('selectedDegreeId', selectedDegreeId)

  const selectedDegree = useMemo(() => {
    return degrees.find((degree) => degree.id === selectedDegreeId) || null
  }, [degrees, selectedDegreeId])

  return (
    <AppContext.Provider
      value={{
        degrees,
        specializations,
        selectedDegree,
        setSelectedDegreeId
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
