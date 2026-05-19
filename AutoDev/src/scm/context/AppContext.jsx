// SCM domain context.
// Auth (user/login/logout) and notifications come from the shared stores at
//   ../../stores/authStore  and  ../../stores/notificationStore.
// This context owns SCM-only state: currency, FX, records, detailView.
// All SCM pages keep their `useApp()` import path.

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import { globalPOs, globalPRs, globalRFQs, globalGRNs } from '../data/mockData'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import { can as canAct } from '../../lib/permissions'

const AppContext = createContext(null)

const CURRENCIES = {
  INR: { symbol: '₹', rate: 1,        code: 'INR', label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012,    code: 'USD', label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011,    code: 'EUR', label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0094,   code: 'GBP', label: 'GBP (£)' },
  JPY: { symbol: '¥', rate: 1.84,     code: 'JPY', label: 'JPY (¥)' },
}

export function AppProvider({ children }) {
  const [currency, setCurrency] = useState('INR')
  const [detailView, setDetailView] = useState({ type: null, id: null, data: null, isOpen: false })
  const [records, setRecords] = useState({
    pos: globalPOs,
    prs: globalPRs,
    rfqs: globalRFQs,
    grns: globalGRNs,
  })

  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const pushNotification = useNotificationStore((s) => s.push)
  const notifications = useNotificationStore((s) => s.notifications)
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const unreadCount = notifications.filter((n) => !n.read).length

  const hasPermission = useCallback(
    (action) => canAct(user?.role, action),
    [user?.role]
  )

  const formatMoney = useCallback(
    (val) => {
      const c = CURRENCIES[currency] ?? CURRENCIES.INR
      const converted = (val ?? 0) * c.rate
      if (currency === 'INR') {
        if (converted >= 10000000) return `${c.symbol}${(converted / 10000000).toFixed(2)}Cr`
        if (converted >= 100000)   return `${c.symbol}${(converted / 100000).toFixed(2)}L`
        return `${c.symbol}${converted.toLocaleString('en-IN')}`
      }
      if (converted >= 1_000_000) return `${c.symbol}${(converted / 1_000_000).toFixed(2)}M`
      if (converted >= 1_000)     return `${c.symbol}${(converted / 1_000).toFixed(1)}K`
      return `${c.symbol}${converted.toFixed(0)}`
    },
    [currency]
  )

  const openDetail = useCallback((type, id, data = null) => {
    setDetailView({ type, id, data, isOpen: true })
  }, [])

  const closeDetail = useCallback(() => {
    setDetailView({ type: null, id: null, data: null, isOpen: false })
  }, [])

  const updateRecordStatus = useCallback(
    (type, id, status, comment = '') => {
      setRecords((prev) => {
        const key = type.toLowerCase() + 's'
        if (!prev[key]) return prev
        const next = { ...prev, [key]: [...prev[key]] }
        const idx = next[key].findIndex((r) => r.id === id)
        if (idx !== -1) {
          const previous = next[key][idx]
          next[key][idx] = {
            ...previous,
            status,
            approvalHistory: [
              ...(previous.approvalHistory || []),
              {
                date: new Date().toISOString(),
                user: user?.name ?? 'System',
                role: user?.role ?? 'SYSTEM',
                action: status,
                comment,
              },
            ],
          }
        }
        return next
      })

      pushNotification({
        title: `${type} ${id} → ${status}`,
        message: `${user?.name ?? 'System'} updated the ${type} record.`,
        type: status === 'Approved' || status === 'Awarded' || status === 'Accepted' ? 'success' : 'critical',
        category: type,
        module: 'SCM',
      })
    },
    [user, pushNotification]
  )

  const approveRequest = useCallback(
    (type, id, comment) => {
      const next = { PR: 'Approved', PO: 'Approved', RFQ: 'Awarded', GRN: 'Accepted' }[type] ?? 'Approved'
      updateRecordStatus(type, id, next, comment)
    },
    [updateRecordStatus]
  )

  const rejectRequest = useCallback(
    (type, id, comment) => updateRecordStatus(type, id, 'Rejected', comment),
    [updateRecordStatus]
  )

  return (
    <AppContext.Provider
      value={{
        // auth / permissions
        user, login, logout, hasPermission,
        // notifications (shared store)
        notifications, unreadCount, markAllRead, markRead,
        // money
        currency, setCurrency, formatMoney, CURRENCIES,
        // detail drawer
        detailView, openDetail, closeDetail,
        // SCM records
        records, approveRequest, rejectRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within scm/AppProvider')
  return ctx
}
