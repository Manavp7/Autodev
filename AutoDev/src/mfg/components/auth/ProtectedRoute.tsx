import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useEffect } from 'react'
import { useLiveStore } from '../../stores/liveStore'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const connect = useLiveStore(s => s.connect)
  const disconnect = useLiveStore(s => s.disconnect)

  useEffect(() => {
    if (isAuthenticated) {
      connect()
      return () => { disconnect() }
    }
  }, [isAuthenticated, connect, disconnect])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
