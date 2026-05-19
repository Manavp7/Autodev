// AppContext is now a thin wrapper around theme state only.
// User / login / logout / hasPermission moved to stores/authStore + lib/permissions.
// Notifications moved to stores/notificationStore.
// SYSTEM_USERS moved to lib/demoUsers (DEV-only).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export interface AppContextType {}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
