// AutoMFG-local UI state: theme + global detail-drawer.
// Notifications now live in `useNotificationStore` (shared across modules).

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  // Detail Modal State
  detailOpen: boolean
  detailType: 'WORK_ORDER' | 'MACHINE' | 'ANDON' | 'QUALITY_DEFECT' | null
  detailId: string | number | null
  detailData: any
  openDetail: (
    type: 'WORK_ORDER' | 'MACHINE' | 'ANDON' | 'QUALITY_DEFECT',
    id: string | number,
    data?: any
  ) => void
  closeDetail: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      detailOpen: false,
      detailType: null,
      detailId: null,
      detailData: null,
      openDetail: (type, id, data) => set({ detailOpen: true, detailType: type, detailId: id, detailData: data }),
      closeDetail: () => set({ detailOpen: false, detailType: null, detailId: null, detailData: null }),
    }),
    { name: 'automfg-app' }
  )
)
