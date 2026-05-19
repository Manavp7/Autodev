import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Mail, 
  MapPin, 
  Shield, 
  Bell, 
  Key, 
  Download, 
  Save, 
  Pencil,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Award
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ProfileCenter = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState('Personal Information')

  const subNav = [
    { name: 'Personal Information', icon: User },
    { name: 'Notification Preferences', icon: Bell },
    { name: 'Security & Permissions', icon: Shield },
    { name: 'API Access Tokens', icon: Key },
  ]

  const programs = [
    { name: 'Alpha SUV 2026', role: 'LEAD', gate: 'Gate 2', progress: 65 },
    { name: 'Omega Sedan EV', role: 'CONTRIB', gate: 'Gate 0', progress: 15 },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-1">
        Settings <ChevronRight size={12} /> User Profile
      </div>

      <div className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-navy-900 to-navy-800 relative">
          <div className="absolute inset-0 opacity-10 flex justify-end pointer-events-none">
             <div className="w-[300px] h-[300px] border-[30px] border-accent rounded-full -mr-20 -mt-20" />
          </div>
        </div>
        <div className="px-8 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-surface p-1 shadow-xl">
                <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center text-text-primary font-black text-4xl border-2 border-white">
                  AR
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-accent text-white rounded-lg shadow-lg hover:bg-accent/90 transition-all">
                <Pencil size={16} />
              </button>
            </div>
            <div className="mb-2 space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-text-primary">Alex Rivera</h1>
                <span className="px-2 py-0.5 bg-sidebar text-white text-[10px] font-black rounded uppercase tracking-widest">L6</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><Briefcase size={14} className="text-accent" /> Chief Engineer</div>
                <div className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> Detroit R&D Center</div>
                <div className="flex items-center gap-1.5 text-accent"><Award size={14} /> ISO 26262 Certified</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mb-2">
            <button className="px-6 py-2.5 border border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:bg-primary flex items-center gap-2">
              <Download size={18} /> Export Profile
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-accent/90 flex items-center gap-2"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sub-nav */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card overflow-hidden p-2">
            {subNav.map((item) => (
              <button 
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all",
                  activeTab === item.name ? "bg-sidebar text-white shadow-md" : "text-text-secondary hover:bg-surface"
                )}
              >
                <item.icon size={16} />
                {item.name}
              </button>
            ))}
          </div>

          <div className="card p-6 space-y-6">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Active Programs</h3>
            <div className="space-y-4">
              {programs.map((prog, i) => (
                <div key={i} className="space-y-2 cursor-pointer group" onClick={() => navigate('/programs')}>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">{prog.name}</p>
                    <span className="text-[8px] font-black bg-teal-50 text-accent px-1 rounded uppercase">{prog.role}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary uppercase">
                    <span>{prog.gate}</span>
                    <span>{prog.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${prog.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panels */}
        <div className="lg:col-span-3 space-y-8">
          <div className="card p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-border-dark pb-4">
              <User size={20} className="text-accent" />
              <h2 className="text-lg font-bold text-text-primary uppercase tracking-widest">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">First Name</label>
                <input type="text" defaultValue="Alex" className="w-full bg-primary border border-border-dark rounded-lg px-4 py-3 text-sm font-bold text-text-primary focus:border-accent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Last Name</label>
                <input type="text" defaultValue="Rivera" className="w-full bg-primary border border-border-dark rounded-lg px-4 py-3 text-sm font-bold text-text-primary focus:border-accent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <input type="email" defaultValue="alex.rivera@autodev.com" readOnly className="w-full bg-surface border border-border-dark rounded-lg px-4 py-3 text-sm font-bold text-text-secondary outline-none cursor-not-allowed" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-accent uppercase">Contact IT</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Department</label>
                <select className="w-full bg-primary border border-border-dark rounded-lg px-4 py-3 text-sm font-bold text-text-primary focus:border-accent outline-none cursor-pointer">
                  <option>Powertrain Engineering</option>
                  <option>Chassis Systems</option>
                  <option>Body-in-White</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Employee ID</label>
                <input type="text" defaultValue="AD-9042-88" readOnly className="w-full bg-surface border border-border-dark rounded-lg px-4 py-3 text-sm font-bold text-text-secondary outline-none" />
              </div>
            </div>
          </div>

          <div className="card p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-border-dark pb-4">
              <Shield size={20} className="text-accent" />
              <h2 className="text-lg font-bold text-text-primary uppercase tracking-widest">Role & Permissions</h2>
            </div>

            <div className="border border-border-dark rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/50 text-[9px] font-black text-text-secondary uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">System Area</th>
                    <th className="px-6 py-4">Access Level</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { area: 'Program Management', level: 'Full Access (Admin)', status: 'ACTIVE' },
                    { area: 'Bill of Materials', level: 'Read/Write', status: 'ACTIVE' },
                    { area: 'ECO Approvals', level: 'Executive Approval', status: 'ACTIVE' },
                    { area: 'User Administration', level: 'View Only', status: 'RESTRICTED' },
                    { area: 'Security Config', level: 'No Access', status: 'NO ACCESS' },
                  ].map((row, i) => (
                    <tr key={i} className="text-xs">
                      <td className="px-6 py-4 font-bold text-text-primary">{row.area}</td>
                      <td className="px-6 py-4 text-text-secondary">{row.level}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                          row.status === 'ACTIVE' ? "bg-teal-50 text-accent" :
                          row.status === 'RESTRICTED' ? "bg-surface text-text-secondary" : "bg-red-50 text-red-500"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCenter
