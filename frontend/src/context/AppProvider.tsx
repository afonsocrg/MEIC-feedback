import { DegreeSelector } from '@components'
import { useDegrees } from '@hooks'
import { useLocalStorage } from '@uidotdev/usehooks'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppContext } from './AppContext'

interface AppProviderProps {
  children: ReactNode
}

const STORAGE_KEYS = {
  SELECTED_DEGREE_ID: '__istFeedback_selectedDegreeId'
}

export function AppProvider({ children }: AppProviderProps) {
  const [searchParams] = useSearchParams()

  const { data: degrees } = useDegrees()
  const [selectedDegreeId, setSelectedDegreeId] = useLocalStorage<
    number | null
  >(STORAGE_KEYS.SELECTED_DEGREE_ID, null)
  const [isDegreeSelectorOpen, setIsDegreeSelectorOpen] = useState(false)

  const selectedDegree = useMemo(() => {
    if (!degrees) return null
    return degrees.find((degree) => degree.id === selectedDegreeId) || null
  }, [degrees, selectedDegreeId])

  const paramsDegreeAcronym = searchParams.get('degree')

  useEffect(() => {
    if (!selectedDegreeId && paramsDegreeAcronym && degrees) {
      const matchingDegree = degrees.find(
        (degree) =>
          degree.acronym.toLowerCase() === paramsDegreeAcronym.toLowerCase()
      )
      if (matchingDegree) {
        setSelectedDegreeId(matchingDegree.id)
      }
    }
  }, [selectedDegreeId, paramsDegreeAcronym, setSelectedDegreeId, degrees])

  return (
    <AppContext.Provider
      value={{
        selectedDegreeId,
        setSelectedDegreeId,
        selectedDegree,
        isDegreeSelectorOpen,
        setIsDegreeSelectorOpen
      }}
    >
      <DegreeSelector
        isOpen={isDegreeSelectorOpen}
        onClose={() => setIsDegreeSelectorOpen(false)}
      />
      {children}
    </AppContext.Provider>
  )
}
