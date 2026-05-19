import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useLiveStore } from '../../stores/liveStore'

const realtimeEnabled = import.meta.env.VITE_REALTIME === 'true'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const connect = useLiveStore((s) => s.connect)
  const disconnect = useLiveStore((s) => s.disconnect)

  useEffect(() => {
    if (!isAuthenticated) return
    // Always start the deterministic mock tick. The store guards the real
    // socket import behind VITE_REALTIME=true.
    connect()
    return () => {
      if (realtimeEnabled) disconnect()
    }
  }, [isAuthenticated, connect, disconnect])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
