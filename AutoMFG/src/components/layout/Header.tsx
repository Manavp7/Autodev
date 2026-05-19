import React, { useState, useRef, useEffect } from 'react'
import { Clock, Search, Bell, Settings, HelpCircle, ChevronDown, Building2, Wifi, WifiOff, LogOut, Command } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useLiveStore } from '../../stores/liveStore'
import { useAppStore } from '../../stores/appStore'
import { useNotificationStore } from '../../stores/notificationStore'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Header() {
  const { user, logout } = useAuthStore()
  const notifications = useNotificationStore((s) => s.notifications)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const markRead = useNotificationStore((s) => s.markRead)
  const unreadCount = notifications.filter((n) => !n.read).length
  const connected = useLiveStore(s => s.connected)
  const navigate = useNavigate()
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-16 border-b border-border-dark bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
      {/* LEFT: Plant + Shift + Live */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm font-medium text-text-primary cursor-pointer hover:text-accent transition-colors">
          <Building2 size={16} />
          {user?.plant || 'Plant Detroit-04'}
          <ChevronDown size={14} className="text-text-secondary" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <Clock size={16} />
          Shift A: Day
        </div>
        <div className={cn("flex items-center gap-1.5 text-xs font-bold", connected ? 'text-success' : 'text-danger')}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? 'Live' : 'Offline'}
        </div>
      </div>

      {/* CENTER: Search */}
      <div className="flex-1 max-w-sm mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search WOs, machines, operators... (Cmd+K)"
            className="w-full bg-primary border border-border-dark rounded-xl pl-10 pr-14 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-surface border border-border-dark rounded text-[10px] text-text-secondary font-bold">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 bg-primary border border-border-dark rounded-xl text-text-secondary hover:text-accent transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-surface border border-border-dark rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-border-dark flex justify-between items-center bg-primary/20">
                <h3 className="font-bold text-text-primary text-sm tracking-tight">Notifications</h3>
                <button onClick={markAllRead} className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="max-h-96 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-secondary">No notifications yet.</div>
                ) : (
                  notifications.slice(0, 12).map((notif) => (
                    <button
                      key={notif.id}
                      type="button"
                      onClick={() => {
                        markRead(notif.id)
                        if (notif.actionPath) navigate(notif.actionPath)
                      }}
                      className={cn(
                        'w-full text-left p-4 border-b border-border-dark hover:bg-primary transition-colors',
                        !notif.read && 'bg-accent/5'
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={cn('text-xs font-bold', notif.read ? 'text-text-secondary' : 'text-text-primary')}>
                          {notif.title}
                        </p>
                        <span className="text-[9px] text-text-secondary font-medium">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-tight">{notif.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-border-dark mx-1" />

        {/* Project badge */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Active Plant</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-success/10 border-success/20 text-success">
            {user?.plant || 'Detroit-04'}
          </span>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <div className="flex-col items-end hidden md:flex">
            <span className="text-sm font-black text-text-primary leading-none">{user?.name}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-accent/10 border-accent/20 text-accent mt-1">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="p-2 bg-danger/10 text-danger rounded-xl hover:bg-danger/20 transition-all border border-danger/20 group"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  )
}
