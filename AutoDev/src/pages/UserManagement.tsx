import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Edit2, 
  Shield, 
  Mail, 
  MapPin, 
  Trash2,
  ChevronRight,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react'
import { cn } from '../utils/cn'

import { Modal } from '../components/Modal'

const UserManagement = () => {
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = React.useState('All Users (124)')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<any>(null)

  const users = [
    { name: 'Alex Rivera', email: 'alex.rivera@autodev.com', role: 'Chief Engineer', dept: 'Powertrain', status: 'Active', lastActive: '2m ago', avatar: 'AR' },
    { name: 'Sarah Jenkins', email: 'sarah.j@autodev.com', role: 'Program Manager', dept: 'Program Mgmt', status: 'Active', lastActive: '15m ago', avatar: 'SJ' },
    { name: 'Michael Chen', email: 'm.chen@autodev.com', role: 'Lead Validation', dept: 'Quality', status: 'Offline', lastActive: '4h ago', avatar: 'MC' },
    { name: 'Elena Vance', email: 'e.vance@autodev.com', role: 'Design Engineer', dept: 'Chassis', status: 'Pending', lastActive: 'N/A', avatar: 'EV' },
    { name: 'David Miller', email: 'd.miller@autodev.com', role: 'VP Engineering', dept: 'Executive', status: 'Active', lastActive: '1h ago', avatar: 'DM' },
  ]

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviteModalOpen(false)
    console.log('Invitation sent successfully', 'success')
  }

  const handleDelete = () => {
    console.log(`User ${userToDelete.name} has been removed`, 'warning')
    setUserToDelete(null)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-1">
            Team Management <ChevronRight size={12} /> Users
          </div>
          <h1 className="text-2xl font-bold text-text-primary">User Management & Roles</h1>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
        >
          <UserPlus size={20} /> Invite User
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div className="border-b border-border-dark w-full lg:w-auto">
          <div className="flex gap-8">
            {['All Users (124)', 'Active', 'Pending'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-4 px-1 text-sm font-black uppercase tracking-widest border-b-2 transition-all",
                  activeTab === tab ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-secondary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search users, roles, departments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border-dark rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:border-accent shadow-sm" 
            />
          </div>
          <button className="px-4 py-2 bg-surface border border-border-dark rounded-lg text-xs font-bold text-text-secondary hover:bg-primary flex items-center gap-2 shadow-sm">
            <Filter size={16} /> Dept
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-primary/50 border-b border-border-dark">
            <tr className="text-[9px] font-black text-text-secondary uppercase tracking-widest">
              <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded" /></th>
              <th className="px-6 py-4">User / Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user, i) => (
              <tr 
                key={i} 
                className="hover:bg-primary transition-colors cursor-pointer group"
                onClick={() => navigate('/settings/profile')}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300 text-accent focus:ring-accent" /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-xs font-black text-text-primary border-2 border-white shadow-sm">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{user.name}</p>
                      <p className="text-[10px] text-text-secondary font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-text-secondary">{user.role}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-surface text-text-secondary text-[9px] font-black rounded uppercase tracking-widest">{user.dept}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit",
                    user.status === 'Active' ? "bg-green-50 text-green-600" :
                    user.status === 'Pending' ? "bg-amber-50 text-amber-600" : "bg-surface text-text-secondary"
                  )}>
                    {user.status === 'Active' ? <UserCheck size={10} /> : user.status === 'Pending' ? <Clock size={10} /> : <UserX size={10} />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase">{user.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-text-secondary hover:text-accent transition-colors"><Edit2 size={14} /></button>
                    <button 
                      className="p-1.5 text-text-secondary hover:text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUserToDelete(user)
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-secondary">
                    <Search size={32} strokeWidth={1} />
                    <p className="text-sm font-medium">No users found matching "{searchQuery}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-4 bg-primary/20 border-t border-gray-50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Showing 5 to 124 users</span>
          <div className="flex gap-2">
            <button className="p-2 bg-surface border border-border-dark rounded text-text-secondary hover:text-text-primary transition-colors"><ChevronRight size={16} className="rotate-180" /></button>
            <button className="p-2 bg-surface border border-border-dark rounded text-text-secondary hover:text-text-primary transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <Modal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        title="Invite New User"
        footer={(
          <>
            <button onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-all">Cancel</button>
            <button onClick={handleInvite} className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-teal-500/20">Send Invite</button>
          </>
        )}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Email Address</label>
            <input type="email" placeholder="user@company.com" className="w-full bg-primary border border-border-dark rounded-lg px-4 py-2.5 outline-none focus:border-accent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Role</label>
              <select className="w-full bg-primary border border-border-dark rounded-lg px-4 py-2.5 outline-none focus:border-accent">
                <option>Select Role</option>
                <option>Chief Engineer</option>
                <option>Program Manager</option>
                <option>Design Engineer</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Department</label>
              <select className="w-full bg-primary border border-border-dark rounded-lg px-4 py-2.5 outline-none focus:border-accent">
                <option>Select Dept</option>
                <option>Powertrain</option>
                <option>Chassis</option>
                <option>Body</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Remove User"
        footer={(
          <>
            <button onClick={() => setUserToDelete(null)} className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-all">Cancel</button>
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition-all">Remove User</button>
          </>
        )}
      >
        <p className="text-text-secondary">Are you sure you want to remove <span className="font-bold text-text-primary">{userToDelete?.name}</span> from the platform? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default UserManagement
