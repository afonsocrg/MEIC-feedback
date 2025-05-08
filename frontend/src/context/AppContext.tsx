import { createContext, ReactNode } from 'react'

export interface AppContextType {
  // intentionally left blank
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>
}
