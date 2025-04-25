import React, { createContext, ReactNode, useContext } from 'react'

interface AppContextType {}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
