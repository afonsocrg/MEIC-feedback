import { AppContext, type AppContextType } from '@context'
import { useContext } from 'react'

export const useApp = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
