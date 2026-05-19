import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Notification {
  id: number
  title: string
  message: string
  type: 'danger' | 'warning' | 'success' | 'info'
  time: string
  read: boolean
}

interface AppStore {
  notifications: Notification[]
  unreadCount: number
  markAllRead: () => void
  markRead: (id: number) => void
  addNotification: (n: Omit<Notification, 'id'>) => void
  // Detail Modal State
  detailOpen: boolean
  detailType: 'WORK_ORDER' | 'MACHINE' | 'ANDON' | 'QUALITY_DEFECT' | null
  detailId: string | number | null
  detailData: any
  openDetail: (type: 'WORK_ORDER' | 'MACHINE' | 'ANDON' | 'QUALITY_DEFECT', id: string | number, data?: any) => void
  closeDetail: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      notifications: [
        { id: 1, title: 'Line 3 Andon Raised',   message: 'Fault detected on Welding Station B.', type: 'danger',  time: '2 min ago', read: false },
        { id: 2, title: 'OEE Below Target',       message: 'Assembly Line 1 OEE at 72% vs 85% target.', type: 'warning', time: '18 min ago', read: false },
        { id: 3, title: 'Shift Handover Due',     message: 'Shift A -> B handover report pending.',    type: 'info',    time: '1 hr ago',  read: false },
        { id: 4, title: 'Work Order WO-2024-841 Completed', message: 'Engine Block machining cycle complete.', type: 'success', time: '2 hr ago', read: true },
        { id: 5, title: 'Spare Part Low Stock',   message: 'Bearing SKF-6205 below safety stock.',    type: 'warning', time: '3 hr ago',  read: true },
      ],
      get unreadCount() { return get().notifications.filter(n => !n.read).length },
      markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
      markRead: (id) => set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
      addNotification: (n) => set(s => ({ notifications: [{ ...n, id: Date.now() }, ...s.notifications] })),
      
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
