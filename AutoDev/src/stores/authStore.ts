// Shared auth store — mirrored verbatim across AutoDev, AutoMFG, AutoSCM.
// Persists under the localStorage key 'auto-suite-auth' so a sign-in in one
// app is visible in the other two when served from the same origin.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role =
  // R&D
  | 'CHIEF_ENGINEER' | 'DESIGN_ENGINEER' | 'VALIDATION_ENGINEER'
  | 'PROGRAM_MANAGER' | 'QUALITY_ENGINEER' | 'SUPPLIER_ENGINEER'
  | 'DOCUMENT_CONTROLLER' | 'SYS_ADMIN'
  // Manufacturing
  | 'PRODUCTION_MANAGER' | 'SHIFT_SUPERVISOR' | 'LINE_LEADER'
  | 'MACHINE_OPERATOR' | 'PRODUCTION_PLANNER' | 'MAINTENANCE_TECH'
  | 'QUALITY_INSPECTOR' | 'PLANT_MANAGER'
  // Supply chain
  | 'CPO' | 'SENIOR_BUYER' | 'BUYER' | 'SUPPLIER_QUALITY_ENGINEER'
  | 'INVENTORY_MANAGER' | 'FINANCE_CONTROLLER' | 'SUPPLIER_PORTAL'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: Role
  designation: string
  plant?: string
  avatarInitials: string
}

interface AuthState {
  user: SessionUser | null
  isAuthenticated: boolean
  login: (u: SessionUser) => void
  logout: () => void
  updateUser: (patch: Partial<SessionUser>) => void
}

export const useAuthStore = create<AuthState>()(
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

export const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
