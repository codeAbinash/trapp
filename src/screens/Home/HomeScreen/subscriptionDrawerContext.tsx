import { UserProfile } from '@/screens/Profile/utils'
import { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface SubscriptionDrawerContextProps {
  isOpened: boolean
  setIsOpened: (value: boolean) => void
}

// Create a context
const SubscriptionDrawerContext = createContext<SubscriptionDrawerContextProps | undefined>(undefined)

// Create a provider component
export const SubscriptionDrawerProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <SubscriptionDrawerContext.Provider value={{ isOpened, setIsOpened }}>
      {children}
    </SubscriptionDrawerContext.Provider>
  )
}

// Create a custom hook to use the context
export const useSubscriptionDrawer = (): SubscriptionDrawerContextProps => {
  const context = useContext(SubscriptionDrawerContext)
  if (!context) {
    throw new Error('useSubscriptionDrawer must be used within a SubscriptionDrawerProvider')
  }
  return context
}
