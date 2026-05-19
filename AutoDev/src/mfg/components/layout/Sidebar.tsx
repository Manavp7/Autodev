import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Calendar, Activity, Wrench, ShieldCheck, Settings, 
  HelpCircle, LogOut, LayoutGrid, ChevronRight, ChevronLeft
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../components/ui/Toast'

const navGroups = [
  {
    name: 'Planning',
    icon: Calendar,
    items: [
      { name: 'Schedule', path: '/planning' },
    ]
  },
  {
    name: 'Operations',
    icon: Activity,
    items: [
      { name: 'Dashboard', path: '/operations', exact: true },
      { name: 'Work Orders', path: '/operations/work-orders' },
      { name: 'Takt Time', path: '/operations/takt' },
      { name: 'Andon Mgmt', path: '/operations/andon' },
      { name: 'Live Assembly', path: '/operations/assembly' },
      { name: 'Shift Handover', path: '/operations/handover' },
      { name: 'OEE Analytics', path: '/operations/oee' },
      { name: 'Alerts', path: '/operations/alerts' },
    ]
  },
  {
    name: 'Maintenance',
    icon: Wrench,
    items: [
      { name: 'Breakdowns', path: '/maintenance/breakdowns' },
      { name: 'Tooling', path: '/maintenance/tooling' },
      { name: 'Registry', path: '/maintenance/registry' },
      { name: 'Spare Parts', path: '/maintenance/parts' },
    ]
  },
  {
    name: 'Quality',
    icon: ShieldCheck,
    items: [
      { name: 'Quality Gate', path: '/quality/gate' },
      { name: 'Scrap/Rework', path: '/quality/scrap-rework' },
      { name: 'EOL Testing', path: '/quality/eol' },
      { name: 'Traceability', path: '/quality/traceability' },
    ]
  },
  {
    name: 'Admin',
    icon: Settings,
    items: [
      { name: 'Reports', path: '/admin/reports' },
      { name: 'Users', path: '/admin/users' },
      { name: 'Config', path: '/admin/config' },
    ]
  }
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()
  const { user } = useAuthStore()

  return (
    <div className={cn(
      "flex flex-col bg-sidebar-bg border-r border-border-dark transition-all duration-300 z-20 shrink-0",
      isOpen ? "w-64" : "w-20"
    )}>

      {/* Logo Area */}
      <div className="flex-between h-20 px-4 border-b border-border-dark shrink-0">
        <div className={cn("flex items-center gap-3 overflow-hidden", !isOpen && "justify-center")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-forest-700 flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-text-primary leading-none">
                Auto<span className="text-accent">MFG</span>
              </span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">
                Enterprise Control
              </span>
            </div>
          )}
        </div>
        {isOpen && (
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-surface rounded text-text-secondary hover:text-text-primary shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-4 px-2 scrollbar-hide">
        {!isOpen && (
          <div className="flex-center mb-2">
            <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-surface rounded text-text-secondary hover:text-text-primary">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        {navGroups.map((group) => (
          <div key={group.name} className="px-1">
            {isOpen && (
              <div className="flex items-center gap-2 px-2 mb-1 text-text-secondary">
                <group.icon size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{group.name}</span>
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={!isOpen ? item.name : undefined}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all relative group",
                      isOpen ? "" : "justify-center",
                      isActive
                        ? "bg-accent/15 text-accent font-bold shadow-sm"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    )}
                  >
                    {/* When collapsed, show group icon as proxy */}
                    {!isOpen && <group.icon className="w-5 h-5 shrink-0" />}
                    {isOpen && <span className="truncate text-[13px] tracking-tight">{item.name}</span>}

                    {/* Tooltip on collapse */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-border-dark text-text-primary text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {group.name} {"->"} {item.name}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom - user */}
      <div className="p-4 border-t border-border-dark shrink-0">
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-forest-700 shrink-0 border-2 border-surface flex items-center justify-center text-white font-bold">
            {user?.avatarInitials || '??'}
          </div>
          {isOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-text-primary truncate">{user?.name}</span>
              <span className="text-xs text-text-secondary truncate capitalize">{user?.role?.replace('_', ' ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
