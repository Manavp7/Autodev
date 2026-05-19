import React, { useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Settings, Bell, Search,
  FileText, GitBranch, CheckSquare, BarChart2, Plus, ChevronLeft, ChevronRight,
  User, Layers, ClipboardCheck, LogOut, Settings as SettingsIcon,
  ChevronDown as ChevronDownIcon, HelpCircle,
  Users, FileSpreadsheet, ShoppingCart, PackageCheck, TrendingUp, AlertTriangle, FileSignature,
  Calendar, Hammer, Factory, Activity, Clock, Users as UsersIcon, Link as LinkIcon, ShieldAlert,
  Wrench, PenTool, Database, Box, CheckCircle, RotateCcw, Monitor, Fingerprint,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useApp } from '../context/AppContext'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import { Dropdown } from '../components/Dropdown'
import ChatBot from '../components/ChatBot'

type Module = 'dev' | 'mfg' | 'scm'

const mfgNavGroups = [
  {
    label: 'Planning & Operations',
    items: [
      { name: 'Schedule', path: '/mfg/planning', icon: Calendar },
      { name: 'Dashboard', path: '/mfg/operations', icon: LayoutDashboard },
      { name: 'Work Orders', path: '/mfg/work-orders', icon: Hammer },
      { name: 'Takt Time', path: '/mfg/takt', icon: Clock },
      { name: 'Andon Mgmt', path: '/mfg/andon', icon: ShieldAlert },
      { name: 'Live Assembly', path: '/mfg/assembly', icon: Factory },
      { name: 'Shift Handover', path: '/mfg/handover', icon: UsersIcon },
      { name: 'OEE Analytics', path: '/mfg/oee', icon: Activity },
      { name: 'Alerts', path: '/mfg/alerts', icon: Bell },
    ],
  },
  {
    label: 'Maintenance',
    items: [
      { name: 'Breakdowns', path: '/mfg/breakdowns', icon: Wrench },
      { name: 'Tooling', path: '/mfg/tooling', icon: PenTool },
      { name: 'Registry', path: '/mfg/registry', icon: Database },
      { name: 'Spare Parts', path: '/mfg/parts', icon: Box },
    ],
  },
  {
    label: 'Quality Control',
    items: [
      { name: 'Quality Gate', path: '/mfg/quality-gate', icon: CheckCircle },
      { name: 'Scrap/Rework', path: '/mfg/scrap-rework', icon: RotateCcw },
      { name: 'EOL Testing', path: '/mfg/eol', icon: Monitor },
      { name: 'Traceability', path: '/mfg/traceability', icon: Fingerprint },
    ],
  },
  {
    label: 'Admin',
    items: [
      { name: 'Reports', path: '/mfg/reports', icon: BarChart2 },
      { name: 'Users', path: '/mfg/users', icon: UsersIcon },
      { name: 'Config', path: '/mfg/config', icon: SettingsIcon },
    ],
  },
]

const scmNavItems = [
  { name: 'Dashboard', path: '/scm/dashboard', icon: LayoutDashboard },
  { name: 'Supplier Mgmt', path: '/scm/suppliers', icon: Users },
  { name: 'Purchase Reqs', path: '/scm/prs', icon: FileText },
  { name: 'RFQ / Tenders', path: '/scm/rfqs', icon: FileSpreadsheet },
  { name: 'Purchase Orders', path: '/scm/pos', icon: ShoppingCart },
  { name: 'Goods Receipt', path: '/scm/grn', icon: PackageCheck },
  { name: 'Supplier Perf', path: '/scm/performance', icon: TrendingUp },
  { name: 'Shortage Mgmt', path: '/scm/shortages', icon: AlertTriangle },
  { name: 'Contract Mgmt', path: '/scm/contracts', icon: FileSignature },
]

const devNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Program Portfolio', path: '/programs' },
  { icon: Layers, label: 'Bill of Materials', path: '/bom' },
  { icon: GitBranch, label: 'Engineering Change', path: '/engineering-change' },
  { icon: ClipboardCheck, label: 'DVP&R', path: '/dvpr' },
  { icon: CheckSquare, label: 'APQP Gates', path: '/gate-approvals' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
]

const Sidebar = ({
  collapsed,
  setCollapsed,
  activeModule,
  setActiveModule,
}: {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  activeModule: Module
  setActiveModule: (m: Module) => void
}) => {
  const navigate = useNavigate()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-sidebar border-r border-border-dark text-text-primary transition-all duration-300 flex flex-col z-50',
        collapsed ? 'w-20' : 'w-[260px]'
      )}
    >
      <div className="flex items-center justify-between px-3 pt-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <NavLink
        to="/dashboard"
        className="h-[60px] flex items-center px-6 gap-3 border-b border-border-dark hover:bg-surface transition-colors flex-shrink-0"
      >
        <div className="w-8 h-8 bg-accent rounded flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">
          A
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight text-text-primary">Auto-Suite</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider">Unified Platform</span>
          </div>
        )}
      </NavLink>

      <div className="p-3 border-b border-border-dark flex-shrink-0">
        {!collapsed && (
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 px-2">
            Select Module
          </div>
        )}
        <div className={cn('flex flex-col gap-1', collapsed && 'items-center')}>
          <button
            type="button"
            onClick={() => {
              setActiveModule('dev')
              navigate('/dashboard')
            }}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors',
              activeModule === 'dev'
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary',
              collapsed && 'justify-center w-10 h-10'
            )}
            title="Product Engineering"
          >
            <Briefcase size={16} /> {!collapsed && 'Product Engineering'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveModule('scm')
              navigate('/scm/dashboard')
            }}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors',
              activeModule === 'scm'
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary',
              collapsed && 'justify-center w-10 h-10'
            )}
            title="Supply Chain"
          >
            <LinkIcon size={16} /> {!collapsed && 'Supply Chain'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveModule('mfg')
              navigate('/mfg/operations')
            }}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors',
              activeModule === 'mfg'
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary',
              collapsed && 'justify-center w-10 h-10'
            )}
            title="Manufacturing"
          >
            <Factory size={16} /> {!collapsed && 'Manufacturing'}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {activeModule === 'dev' && (
          <div className="px-2 space-y-1">
            <div className="p-2">
              <NavLink
                to="/programs/new"
                className={cn(
                  'w-full bg-accent hover:bg-accent/90 text-white font-bold flex items-center justify-center gap-2 transition-all rounded-xl py-2 shadow-lg shadow-accent/20 text-sm',
                  collapsed ? 'px-0' : 'px-4'
                )}
              >
                <Plus size={18} />
                {!collapsed && <span>New Program</span>}
              </NavLink>
            </div>
            {devNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'sidebar-link group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-text-secondary hover:text-text-primary hover:bg-surface text-sm',
                    isActive && 'bg-surface text-accent font-medium shadow-sm border border-border-dark',
                    collapsed && 'justify-center px-0 border-none'
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} className={cn(collapsed ? 'mx-auto' : '')} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        )}

        {activeModule === 'mfg' && (
          <div className="px-2 space-y-4">
            {mfgNavGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {!collapsed && (
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-4 mb-1">
                    {group.label}
                  </div>
                )}
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'sidebar-link group flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-text-secondary hover:text-text-primary hover:bg-surface text-sm',
                        isActive && 'bg-surface text-accent font-medium shadow-sm border border-border-dark',
                        collapsed && 'justify-center px-0 border-none py-2.5'
                      )
                    }
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon size={18} className={cn(collapsed ? 'mx-auto' : '')} />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeModule === 'scm' && (
          <div className="px-2 space-y-1">
            {scmNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'sidebar-link group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-text-secondary hover:text-text-primary hover:bg-surface text-sm',
                    isActive && 'bg-surface text-accent font-medium shadow-sm border border-border-dark',
                    collapsed && 'justify-center px-0 border-none'
                  )
                }
                title={collapsed ? item.name : undefined}
              >
                <item.icon size={18} className={cn(collapsed ? 'mx-auto' : '')} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-2 border-t border-border-dark space-y-1 flex-shrink-0">
        <NavLink
          to="/settings/profile"
          className={cn(
            'sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-text-secondary hover:text-text-primary hover:bg-surface text-sm',
            collapsed && 'justify-center px-0'
          )}
        >
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  )
}

const TopNav = ({ collapsed }: { collapsed: boolean }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const notifications = useNotificationStore((s) => s.notifications)
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const unreadCount = notifications.filter((n) => !n.read).length

  const [search, setSearch] = React.useState('')
  const pathParts = location.pathname.split('/').filter(Boolean)

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-[60px] glass border-b border-border-dark z-40 flex items-center justify-between px-6 transition-all duration-300',
        collapsed ? 'left-20' : 'left-[260px]'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm text-text-secondary gap-2">
          <span>Platform</span>
          {pathParts.map((part, i) => (
            <React.Fragment key={i}>
              <span className="text-border-dark">/</span>
              <span
                className={cn(
                  i === pathParts.length - 1 ? 'text-text-primary font-medium capitalize' : 'capitalize'
                )}
              >
                {part.replace(/-/g, ' ')}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-[300px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <label htmlFor="topbar-search" className="sr-only">Search platform</label>
          <input
            id="topbar-search"
            type="text"
            placeholder="Search platform..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-surface border border-border-dark rounded-full py-2 pl-10 pr-4 text-sm text-text-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-text-secondary/50"
          />
        </div>

        <div className="flex items-center gap-4 text-text-secondary">
          <Dropdown
            trigger={
              <button type="button" className="relative hover:text-text-primary transition-colors p-1" aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-danger text-white text-[8px] flex items-center justify-center rounded-full border-2 border-primary">
                    {unreadCount}
                  </span>
                )}
              </button>
            }
          >
            <div className="p-4 border-b border-border-dark flex justify-between items-center">
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-widest">Notifications</h4>
              <button onClick={markAllRead} className="text-[10px] text-accent font-bold hover:underline" type="button">
                Mark all read
              </button>
            </div>
            <div className="divide-y divide-border-dark max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-text-secondary">No notifications</div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      markRead(n.id)
                      if (n.actionPath) navigate(n.actionPath)
                    }}
                    className={cn(
                      'w-full text-left p-4 hover:bg-surface group transition-colors',
                      !n.read && 'bg-surface/50'
                    )}
                  >
                    <h5 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                      {n.title}
                    </h5>
                    <p className="text-[10px] text-text-secondary mt-1">{n.message}</p>
                  </button>
                ))
              )}
            </div>
            <div className="p-2 border-t border-border-dark">
              <NavLink to="/notifications" className="block text-center text-xs text-accent font-semibold py-2 hover:bg-surface rounded">
                View all
              </NavLink>
            </div>
          </Dropdown>
        </div>

        <div className="h-8 w-px bg-border-dark mx-2" />

        <Dropdown
          trigger={
            <button type="button" className="flex items-center gap-3 cursor-pointer group" aria-label="Account menu">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-text-primary leading-none">{user?.name ?? 'Guest'}</span>
                <span className="text-[10px] text-text-secondary uppercase mt-1">{user?.role ?? '—'}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-surface border border-border-dark flex items-center justify-center text-text-primary group-hover:border-accent transition-all shadow-lg overflow-hidden">
                {user?.avatarInitials ? (
                  <span className="text-xs font-bold">{user.avatarInitials}</span>
                ) : (
                  <User size={20} />
                )}
              </div>
              <ChevronDownIcon size={14} className="text-text-secondary group-hover:text-text-primary" />
            </button>
          }
        >
          <div className="py-2 min-w-[220px]">
            <NavLink to="/settings/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors">
              <User size={16} /> Profile
            </NavLink>
            <NavLink to="/settings/users" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors">
              <UsersIcon size={16} /> Users
            </NavLink>
            <NavLink to="/notifications" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors">
              <Bell size={16} /> Notifications
            </NavLink>
            <NavLink to="/help" className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors">
              <HelpCircle size={16} /> Help
            </NavLink>
            <div className="my-1 border-t border-border-dark" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </Dropdown>
      </div>
    </header>
  )
}

const moduleThemeClass: Record<Module, string> = {
  dev: 'dev-theme',
  mfg: 'mfg-theme',
  scm: 'scm-theme',
}

const MainLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false)
  const location = useLocation()
  const [activeModule, setActiveModule] = React.useState<Module>('dev')

  useEffect(() => {
    if (location.pathname.startsWith('/mfg')) setActiveModule('mfg')
    else if (location.pathname.startsWith('/scm')) setActiveModule('scm')
    else setActiveModule('dev')
  }, [location.pathname])

  return (
    <div className={cn('min-h-screen bg-primary', moduleThemeClass[activeModule])}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      <TopNav collapsed={collapsed} />
      <main className={cn('pt-[60px] transition-all duration-300', collapsed ? 'pl-20' : 'pl-[260px]')}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
      <ChatBot />
    </div>
  )
}

export default MainLayout
