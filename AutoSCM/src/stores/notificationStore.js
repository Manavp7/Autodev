// Single source of truth for notifications across the bell badge,
// notification center page, and any module that wants to surface alerts.
// Persists under 'auto-suite-notifications'.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const uid = () =>
  `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      push: (n) =>
        set((s) => ({
          notifications: [
            {
              id: n.id ?? uid(),
              timestamp: n.timestamp ?? new Date().toISOString(),
              read: n.read ?? false,
              ...n,
            },
            ...s.notifications,
          ].slice(0, 200),
        })),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      clear: () => set({ notifications: [] }),
      remove: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
    }),
    { name: 'auto-suite-notifications' }
  )
)

export const useUnreadCount = () =>
  useNotificationStore((s) => s.notifications.filter((n) => !n.read).length)
