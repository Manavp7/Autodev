import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Filter, 
  Search, 
  Plus, 
  Download, 
  ExternalLink,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FlaskConical,
  Wrench,
  ChevronRight
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useEventBus } from '../stores/eventBus'
import { useAuthStore } from '../stores/authStore'
import { recordAudit } from '../lib/audit'

const PrototypeBuildAndTest = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = React.useState('test-requests')
  const emit = useEventBus((s) => s.emit)
  const userId = useAuthStore((s) => s.user?.id ?? 'unknown')

  const handleNewBuildOrder = () => {
    const programId = 'PRG-ALPHA'
    const parts = [
      { pn: 'PART-0012', qty: 4 },
      { pn: 'PART-0013', qty: 4 },
      { pn: 'FAST-0842', qty: 32 },
    ]
    emit({ type: 'prototype.parts.needed', programId, parts })
    recordAudit({
      entity: 'PBO',
      entityId: `PBO-${Date.now().toString(36).toUpperCase()}`,
      action: 'CREATE_PROTOTYPE_BUILD_ORDER',
      userId,
      after: { programId, parts },
    })
  }

  const testRequests = [
    { id: 'TRQ-4092', type: 'Thermal Stress', lab: 'Safety Lab 4', standard: 'ISO 16750', engineer: 'Alex Rivera', date: 'May 20, 2024', result: 'Pass', status: 'Approved' },
    { id: 'TRQ-4088', type: 'Ingress Protection', lab: 'Environmental Lab', standard: 'IEC 60529', engineer: 'Sarah Jenkins', date: 'May 22, 2024', result: 'Fail', status: 'Rejected' },
    { id: 'TRQ-4075', type: 'Durability Sweep', lab: 'Chassis Dynamics', standard: 'ASTM D4169', engineer: 'Michael Chen', date: 'May 18, 2024', result: 'Conditional', status: 'In Review' },
    { id: 'TRQ-4060', type: 'EMC Emission', lab: 'Electronics Lab', standard: 'CISPR 25', engineer: 'Elena Vance', date: 'May 25, 2024', result: 'Pending', status: 'Scheduled' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Prototype Build & Test Request</h1>
          <p className="text-text-secondary">Manage prototype assembly schedules and validate testing requirements.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 border border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:bg-primary flex items-center gap-2">
            <Download size={18} /> Export
          </button>
          <button
            onClick={handleNewBuildOrder}
            className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-accent/90 flex items-center gap-2"
          >
            <Plus size={18} /> New Request
          </button>
        </div>
      </div>

      <div className="border-b border-border-dark">
        <div className="flex gap-8">
          {[
            { id: 'build-orders', label: 'Build Orders', icon: Wrench },
            { id: 'test-requests', label: 'Test Requests', icon: FlaskConical },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 py-4 px-1 text-sm font-black uppercase tracking-widest border-b-2 transition-all",
                activeTab === tab.id ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-secondary"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'test-requests' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input type="text" placeholder="Filter requests..." className="w-full bg-surface border border-border-dark rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:border-accent" />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface border border-border-dark rounded-lg text-xs font-bold text-text-secondary hover:bg-primary flex items-center gap-2">
                <Filter size={16} /> Filter
              </button>
              <select className="bg-surface border border-border-dark rounded-lg px-4 py-2 text-xs font-bold text-text-primary outline-none">
                <option>All Statuses</option>
                <option>Scheduled</option>
                <option>In Review</option>
                <option>Complete</option>
              </select>
            </div>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-primary text-[9px] font-black text-text-secondary uppercase tracking-widest">
                <tr className="border-b border-border-dark">
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Test Type</th>
                  <th className="px-6 py-4">Test Lab</th>
                  <th className="px-6 py-4">Test Standard</th>
                  <th className="px-6 py-4">Assigned Engineer</th>
                  <th className="px-6 py-4">Scheduled Date</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {testRequests.map((req, i) => (
                  <tr key={i} className="hover:bg-primary transition-colors cursor-pointer group" onClick={() => navigate('/dvpr')}>
                    <td className="px-6 py-4 text-xs font-black text-accent hover:underline">{req.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-text-primary">{req.type}</td>
                    <td className="px-6 py-4 text-xs text-text-secondary">{req.lab}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-surface text-text-secondary text-[9px] font-bold rounded uppercase tracking-widest">{req.standard}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-sidebar text-white flex items-center justify-center text-[8px] font-black">{req.engineer.split(' ').map(n => n[0]).join('')}</div>
                        <span className="text-xs font-bold text-text-secondary">{req.engineer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary font-medium">{req.date}</td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
                        req.result === 'Pass' ? "text-green-500" :
                        req.result === 'Fail' ? "text-red-500" :
                        req.result === 'Conditional' ? "text-amber-500" : "text-gray-300"
                       )}>
                        {req.result === 'Pass' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                        {req.result === 'Fail' && <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                        {req.result === 'Conditional' && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                        {req.result === 'Pending' && <Clock size={12} />}
                        {req.result}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-300 hover:text-text-primary transition-colors"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Showing 4 of 42 entries</span>
            <div className="flex gap-2">
              <button className="p-2 border border-border-dark rounded text-text-secondary hover:text-text-primary transition-colors"><ChevronRight size={16} className="rotate-180" /></button>
              <button className="p-2 border border-border-dark rounded text-text-secondary hover:text-text-primary transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrototypeBuildAndTest
