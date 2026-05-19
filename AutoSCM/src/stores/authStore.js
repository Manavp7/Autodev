// Shared auth store — mirrored verbatim across AutoDev, AutoMFG, AutoSCM.
// Persists under the localStorage key 'auto-suite-auth' so a sign-in in one
// app is visible in the other two when served from the same origin.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (u) => set({ user: u, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
    }),
    { name: 'auto-suite-auth' }
  )
)

export const initialsOf = (name) =>
  String(name || '')
    .split(' ')
    .filter(Boolean)
    .map((p) => (p[0] || '').toUpperCase())
    .slice(0, 2)
    .join('')
