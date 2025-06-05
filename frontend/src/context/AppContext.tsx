import {
  type Course,
  type CourseGroup,
  type Degree
} from '@services/meicFeedbackAPI'
import { createContext } from 'react'

export interface AppContextType {
  degrees: Degree[]
  courses: Course[]
  courseGroups: CourseGroup[]
  // The context stores both selectedDegreeId and selectedDegree object
  // selectedDegreeId is used as the source of truth because:
  // 1. It persists across page loads via localStorage
  // 2. It's available immediately, while selectedDegree may be null
  //    until the degrees data is loaded from the API
  selectedDegreeId: number | null
  setSelectedDegreeId: (degreeId: number | null) => void
  selectedDegree: Degree | null
  isDegreeSelectorOpen: boolean
  setIsDegreeSelectorOpen: (isOpen: boolean) => void
  isLoading: boolean
}

export const AppContext = createContext<AppContextType | undefined>(undefined)
