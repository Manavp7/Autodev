import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Cell, 
  PieChart, 
  Pie,
  Legend
} from 'recharts'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download, 
  Filter, 
  MoreVertical,
  Activity,
  DollarSign,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const KPICard = ({ title, value, trend, trendType, icon: Icon, color, path }: any) => {
  const navigate = useNavigate()
  return (
    <div 
      onClick={() => path && navigate(path)}
      className={cn("card p-6 border-t-4 cursor-pointer hover:shadow-md transition-all group", color)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-text-primary shadow-sm border border-border-dark">
          <Icon size={20} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
          trendType === 'up' ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
        )}>
          {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black text-text-primary">{value}</h3>
        {title.includes('Budget') && <span className="text-xs text-text-secondary font-bold uppercase">/ $50.0M</span>}
      </div>
      {title.includes('Budget') && (
        <div className="mt-4 h-1.5 w-full bg-primary rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: '85%' }} />
        </div>
      )}
    </div>
  )
}

const ExecutiveDashboard = () => {
  const navigate = useNavigate()
  const barData = [
    { name: 'Jan', initial: 12, final: 18 },
    { name: 'Feb', initial: 10, final: 22 },
    { name: 'Mar', initial: 15, final: 25 },
    { name: 'Apr', initial: 18, final: 20 },
    { name: 'May', initial: 14, final: 28 },
    { name: 'Jun', initial: 20, final: 30 },
  ]

  const lineData = [
    { name: 'W1', target: 2000, actual: 2150 },
    { name: 'W2', target: 2000, actual: 2100 },
    { name: 'W3', target: 2000, actual: 2040 },
    { name: 'W4', target: 2000, actual: 2020 },
    { name: 'W5', target: 2000, actual: 2005 },
    { name: 'W6', target: 2000, actual: 1990 },
  ]

  const pieData = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'In Progress', value: 25, color: '#F59E0B' },
    { name: 'At Risk', value: 10, color: '#EF4444' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Executive KPI Dashboard</h1>
          <p className="text-text-secondary">Program Status Overview & Critical Metrics across the enterprise.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface border border-border-dark rounded-lg flex items-center px-4 py-2 gap-3 shadow-sm cursor-pointer">
            <Calendar size={18} className="text-text-secondary" />
            <span className="text-sm font-bold text-text-primary">Q3 2024</span>
            <ChevronDown size={16} className="text-text-secondary" />
          </div>
          <button className="px-6 py-2.5 bg-accent text-white rounded-lg font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-accent/90 transition-all flex items-center gap-2">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Total Program Health" value="92.4%" trend="+4.2%" trendType="up" icon={Activity} color="border-t-green-500" path="/programs" />
        <KPICard title="Budget Utilization" value="85.0%" trend="+12.5%" trendType="up" icon={DollarSign} color="border-t-amber-500" path="/integration-hub" />
        <KPICard title="Compliance Rate" value="98.2%" trend="-0.4%" trendType="down" icon={ShieldCheck} color="border-t-teal-500" path="/apqp/PRG-8042" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">ECO Cycle Time (Days)</h3>
            <button className="text-gray-300 hover:text-text-primary transition-colors"><MoreVertical size={16} /></button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#111827', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="initial" fill="#9CA3AF" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="final" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 pt-4 border-t border-border-dark">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-400 rounded-sm" /><span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Initial Review</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-accent rounded-sm" /><span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Final Approval</span></div>
          </div>
        </div>

        <div className="card p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Curb Weight Deviation vs Target (kg)</h3>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-sidebar text-white text-[9px] font-bold rounded cursor-pointer">Platform A</span>
              <span className="px-2 py-0.5 bg-primary text-text-secondary text-[9px] font-bold rounded cursor-pointer hover:bg-surface transition-colors">Platform B</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }} domain={[1900, 2200]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#111827', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 pt-4 border-t border-border-dark">
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-gray-400 border-dashed border-t-2" /><span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Target Weight</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-accent" /><span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Actual Deviation</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">APQP Gate Status Distribution</h3>
            <button className="text-gray-300 hover:text-text-primary transition-colors"><MoreVertical size={16} /></button>
          </div>
          <div className="h-[300px] w-full flex items-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={80} 
                  outerRadius={110} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#111827', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-4">
               <span className="text-4xl font-black text-text-primary">42</span>
               <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Gates</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 pt-4 border-t border-gray-50">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[9px] font-black uppercase text-text-secondary tracking-tighter">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card flex flex-col">
          <div className="p-8 border-b border-border-dark flex justify-between items-center bg-primary/20">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Critical Engineering Alerts</h3>
            <button className="text-[10px] font-bold text-accent hover:underline" onClick={() => navigate('/notifications')}>View All</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {[
                  { program: 'Alpha SUV', issue: 'Battery cooling validation failure', severity: 'High', date: '2h ago' },
                  { program: 'Delta Pickup', issue: 'Material supply chain delay (AL-6061)', severity: 'Med', date: '5h ago' },
                  { program: 'Omega Sedan', issue: 'Software sprint 4 scope reduction', severity: 'Med', date: '8h ago' },
                  { program: 'Sigma Compact', issue: 'Gate 0 feasibility rejection', severity: 'High', date: '1d ago' },
                  { program: 'Gamma Hatchback', issue: 'Battery cell delivery short', severity: 'High', date: '1d ago' },
                  { program: 'Zeta Coupe', issue: 'Chassis strength test failure', severity: 'High', date: '2d ago' },
                  { program: 'Alpha SUV', issue: 'Supplier quality deviation', severity: 'Med', date: '2d ago' },
                  { program: 'Iota Truck EV', issue: 'Motor controller overheating', severity: 'High', date: '2d ago' },
                  { program: 'Theta SUV', issue: 'Software integration bug', severity: 'Med', date: '3d ago' },
                  { program: 'Lambda Sport', issue: 'Aerodynamics wind tunnel fail', severity: 'High', date: '3d ago' },
                  { program: 'Kappa Sedan', issue: 'Interior material shortage', severity: 'Med', date: '4d ago' },
                  { program: 'Delta Pickup', issue: 'Suspension component crack', severity: 'High', date: '5d ago' },
                ].map((alert, i) => (
                  <tr 
                    key={i} 
                    className="hover:bg-primary/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(alert.severity === 'High' ? '/dvpr' : '/engineering-change')}
                  >
                    <td className="px-8 py-4">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-0.5">{alert.program}</p>
                      <p className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">{alert.issue}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                        alert.severity === 'High' ? "bg-red-50 text-red-500 border border-red-100" : "bg-amber-50 text-amber-500 border border-amber-100"
                      )}>
                        {alert.severity} Severity
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right text-[10px] font-bold text-text-secondary uppercase">{alert.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const ChevronDown = ({ className, size }: { className?: string, size?: number }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>

export default ExecutiveDashboard
