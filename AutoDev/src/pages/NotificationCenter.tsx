import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bell, 
  Settings, 
  Search, 
  AlertCircle, 
  FileEdit, 
  CheckCircle2, 
  Trash2, 
  MoreHorizontal,
  Info,
  Clock,
  ShieldAlert,
  ChevronRight
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NotificationCard = ({ note }: any) => {
  const navigate = useNavigate()
  const Icon = note.type === 'Critical' ? ShieldAlert : note.type === 'Warning' ? AlertCircle : Info
  const borderColor = note.type === 'Critical' ? 'border-l-red-500' : note.type === 'Warning' ? 'border-l-amber-500' : 'border-l-teal-500'
  const iconColor = note.type === 'Critical' ? 'bg-red-50 text-red-500' : note.type === 'Warning' ? 'bg-amber-50 text-amber-500' : 'bg-teal-50 text-accent'
  
  const path = note.category === 'Engineering Change' ? '/engineering-change' : 
               note.category === 'Program Update' ? '/programs' : 
               note.category === 'Document Update' ? '/documents' : 
               note.category === 'System Alert' ? '/dvpr/prototype' : '/settings/profile'
               
  return (
    <div className={cn(
      "card p-5 flex gap-4 transition-all hover:shadow-md cursor-pointer border-l-4 group",
      borderColor,
      note.read ? "opacity-60 bg-primary/50" : "bg-surface shadow-sm"
    )}>
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", iconColor)}>
        <Icon size={20} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-text-primary leading-tight">{note.title}</h4>
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{note.category}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-black text-gray-300 uppercase">{note.time}</span>
            <button className="text-gray-300 hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100"><MoreHorizontal size={14} /></button>
          </div>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">{note.desc}</p>
        <div className="flex gap-3 pt-2">
          <button className="px-3 py-1.5 border border-border-dark rounded text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-primary hover:text-text-primary transition-all">Acknowledge</button>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              navigate(path)
            }}
            className="px-3 py-1.5 bg-teal-50 text-accent rounded text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
          >
            {note.actionText || 'View Details'}
          </button>
        </div>
      </div>
    </div>
  )
}

const NotificationCenter = () => {
  const [activeCategory, setActiveCategory] = React.useState('All')

  const notifications = [
    { type: 'Critical', title: 'ECO-4092 Approval Overdue', category: 'Engineering Change', time: '2h ago', desc: 'The Engineering Change Order for Battery Thermal Module has exceeded the SLA by 48 hours. Immediate action required by Chief Engineer.', actionText: 'View ECO', read: false },
    { type: 'Info', title: 'Gate 1 Review Completed', category: 'Program Update', time: '4h ago', desc: 'Delta Pickup X has successfully transitioned through Gate 1. All stakeholders have signed off on the Concept Design phase.', actionText: 'View Program', read: true },
    { type: 'Warning', title: 'Lab Capacity Alert', category: 'System Alert', time: '6h ago', desc: 'The Environmental Lab is currently at 95% capacity. New DVP&R test requests may experience delays of up to 5 business days.', actionText: 'View Lab Schedule', read: false },
    { type: 'Info', title: 'New Document Shared', category: 'Document Update', time: '1d ago', desc: 'Michael Chen shared "BIW Material Safety Data Sheet V4.0" with you. Click to review and acknowledge receipt.', actionText: 'Review Doc', read: true },
    { type: 'Warning', title: 'Certification Expiring', category: 'User Management', time: '2d ago', desc: 'Your ISO 26262 functional safety certification will expire in 15 days. Please contact the HR department to schedule renewal.', actionText: 'Renewal Link', read: false },
  ]

  const categories = [
    { name: 'All Notifications', count: 12 },
    { name: 'System Alerts', count: 3 },
    { name: 'Engineering Changes', count: 5 },
    { name: 'Task Updates', count: 4 },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notification Center</h1>
          <p className="text-text-secondary">Manage engineering alerts, changes, and system statuses.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 border border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:bg-primary flex items-center gap-2">
            Mark All Read
          </button>
          <button className="p-2.5 bg-surface border border-border-dark rounded-lg text-text-secondary hover:text-text-primary transition-all shadow-sm">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-border-dark bg-primary/20">
               <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                 <input type="text" placeholder="Search categories..." className="w-full bg-surface border border-border-dark rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none focus:border-accent" />
               </div>
            </div>
            <div className="p-2 space-y-1">
              {categories.map((cat, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveCategory(cat.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold transition-all group",
                    activeCategory === cat.name ? "bg-sidebar text-white shadow-md" : "text-text-secondary hover:bg-surface"
                  )}
                >
                  {cat.name}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black",
                    activeCategory === cat.name ? "bg-accent text-white" : "bg-surface text-text-secondary group-hover:bg-gray-200"
                  )}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Priority Filters</h3>
            <div className="space-y-3">
              {[
                { label: 'Critical', color: 'bg-red-500' },
                { label: 'Warning', color: 'bg-amber-500' },
                { label: 'Info', color: 'bg-accent' },
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-text-primary focus:ring-navy-900" defaultChecked />
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors">{item.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Recent Notifications</span>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest cursor-pointer hover:underline">Clear Feed</span>
          </div>
          <div className="space-y-4">
            {notifications.map((note, i) => (
              <NotificationCard key={i} note={note} />
            ))}
          </div>
          <div className="pt-8 flex justify-center">
            <button className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
              Load older notifications <ChevronRight size={14} className="rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter
