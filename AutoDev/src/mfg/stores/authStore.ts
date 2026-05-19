import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api'

interface User {
  id: string
  name: string
  email: string
  role: string
  badgeId: string
  plant: string
  avatarInitials: string
  isActive: boolean
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { token, user } = await authApi.login(email, password)
          localStorage.setItem('automfg_token', token)
          set({ user, token, isAuthenticated: true, isLoading: false })
        } catch (err: any) {
          const message = err?.response?.data?.error || 'Login failed. Please try again.'
          set({ isLoading: false, error: message })
        }
      },

      logout: () => {
        localStorage.removeItem('automfg_token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'automfg-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
