import React from 'react'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  ChevronRight,
  MoreHorizontal,
  Plus
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { useNavigate } from 'react-router-dom'

import { Modal } from '../components/Modal'

const DVPR = () => {
  const navigate = useNavigate()
  const [tests, setTests] = React.useState([
    { id: 'TEST-001', item: 'Thermal Cycle - High/Low', method: 'ISO 16750-4', criteria: 'No deformation after 500 cycles', sample: 'SN-042', ref: 'TR-904', result: 'Pass', status: 'Approved' },
    { id: 'TEST-002', item: 'Mechanical Shock', method: 'ISO 16750-3', criteria: 'Functional integrity after 100G impact', sample: 'SN-042', ref: 'TR-905', result: 'Pass', status: 'Approved' },
    { id: 'TEST-003', item: 'IP67 Ingress Test', method: 'IEC 60529', criteria: 'No water entry after 30 min at 1m', sample: 'SN-043', ref: 'TR-906', result: 'Fail', status: 'Rejected' },
    { id: 'TEST-004', item: 'Vibration Endurance', method: 'ASTM D4169', criteria: 'No structural cracks after 48h sweep', sample: 'SN-044', ref: 'TR-907', result: 'Pending', status: 'In Test' },
    { id: 'TEST-005', item: 'Fast Charge Stress', method: 'OEM-SPEC-4.0', criteria: 'Temp < 45C at 250kW charging', sample: 'SN-045', ref: 'TR-908', result: 'Pass', status: 'Pending Sign-off' },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [bulkSignoffSuccess, setBulkSignoffSuccess] = React.useState(false)
  const [newTest, setNewTest] = React.useState({
    item: '',
    method: '',
    criteria: '',
    sample: '',
  })

  const handleAddTest = () => {
    if (!newTest.item || !newTest.method || !newTest.criteria) return
    const nextId = `TEST-00${tests.length + 1}`
    setTests(prev => [...prev, {
      id: nextId,
      item: newTest.item,
      method: newTest.method,
      criteria: newTest.criteria,
      sample: newTest.sample || 'SN-NEW',
      ref: `TR-9${10 + tests.length}`,
      result: 'Pending',
      status: 'In Test'
    }])
    setIsAddModalOpen(false)
    setNewTest({ item: '', method: '', criteria: '', sample: '' })
  }

  const handleBulkSignoff = () => {
    setTests(prev => prev.map(t => 
      t.status === 'Pending Sign-off' ? { ...t, status: 'Approved' } : t
    ))
    setBulkSignoffSuccess(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-1">
            Program Alpha <ChevronRight size={12} /> Battery Enclosure
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Design Validation Plan & Report</h1>
            <span className="px-2 py-0.5 bg-teal-50 text-accent text-[10px] font-bold rounded uppercase">In Progress</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => alert('PDF export coming soon!')} className="px-6 py-2.5 border border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:bg-primary flex items-center gap-2">
            <Download size={18} /> Export PDF
          </button>
          <button 
            onClick={handleBulkSignoff}
            className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-accent/90 flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> Bulk Sign-off
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Header Meta */}
          <div className="card p-6 grid grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Part Number</p>
              <p className="font-bold text-text-primary">8042-BATT-ENV</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Validation Lead</p>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-sidebar text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                <p className="font-bold text-text-primary">Michael Chen</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Phase</p>
              <p className="font-bold text-text-primary">DV-1 Prototype</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Target Sign-Off</p>
              <p className="font-bold text-text-primary">June 30, 2026</p>
            </div>
          </div>

          {/* Test Matrix */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-border-dark flex justify-between items-center bg-primary/50">
              <div className="relative w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input type="text" placeholder="Search test items..." className="w-full bg-surface border border-border-dark rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none focus:border-accent" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-border-dark rounded-lg text-text-secondary hover:text-text-primary"><Filter size={16} /></button>
                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-1.5 bg-surface border border-border-dark rounded-lg text-[10px] font-bold text-text-primary hover:bg-primary flex items-center gap-2">
                  <Plus size={14} /> Add Test Item
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-dark text-[9px] font-black text-text-secondary uppercase tracking-widest bg-primary/20">
                    <th className="px-4 py-3"><input type="checkbox" className="rounded" /></th>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Test Item</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Acceptance Criteria</th>
                    <th className="px-4 py-3">Sample</th>
                    <th className="px-4 py-3">TR Ref</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tests.map((test, i) => (
                    <tr key={i} className="text-xs group hover:bg-primary transition-colors">
                      <td className="px-4 py-4"><input type="checkbox" className="rounded" /></td>
                      <td className="px-4 py-4 font-black text-text-secondary">{test.id}</td>
                      <td className="px-4 py-4 font-bold text-text-primary">{test.item}</td>
                      <td className="px-4 py-4 text-text-secondary font-mono">{test.method}</td>
                      <td className="px-4 py-4 text-text-secondary max-w-[180px] truncate">{test.criteria}</td>
                      <td className="px-4 py-4 text-text-secondary">{test.sample}</td>
                      <td className="px-4 py-4">
                        <button 
                          onClick={() => navigate('/dvpr/prototype')}
                          className="text-accent font-bold flex items-center gap-1 hover:underline"
                        >
                          {test.ref} <ExternalLink size={10} />
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "font-black uppercase",
                          test.result === 'Pass' ? "text-green-500" : 
                          test.result === 'Fail' ? "text-red-500" : "text-gray-300"
                        )}>
                          {test.result}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter whitespace-nowrap",
                          test.status === 'Approved' ? "bg-green-50 text-green-600" :
                          test.status === 'Rejected' ? "bg-red-50 text-red-600" :
                          test.status === 'Pending Sign-off' ? "bg-teal-50 text-accent" : "bg-surface text-text-secondary"
                        )}>
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - Statistics */}
        <div className="space-y-6">
          <div className="card p-8 flex flex-col items-center justify-center text-center space-y-6">
            <h3 className="text-sm font-bold text-text-primary">Validation Pass Rate</h3>
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle 
                  cx="80" cy="80" r="70" fill="none" stroke="#1A9E8F" strokeWidth="12" 
                  strokeDasharray="440" strokeDashoffset="140" strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-text-primary">68%</span>
                <span className="text-[10px] font-bold text-text-secondary uppercase">24/35 Tests</span>
              </div>
            </div>
            <div className="w-full space-y-3 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-bold uppercase">Critical Failures</span>
                <span className="text-red-500 font-black">02</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-bold uppercase">Retests Required</span>
                <span className="text-amber-500 font-black">04</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-bold uppercase">Lab Backlog</span>
                <span className="text-text-secondary font-black">12 Days</span>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Recent Test Activity</h3>
            <div className="space-y-4">
              {[
                { test: 'TR-904', action: 'Approved by Quality', time: '1h ago' },
                { test: 'TR-906', action: 'Failure logged - Retest scheduled', time: '3h ago' },
                { test: 'TR-902', action: 'Sign-off requested', time: '5h ago' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5" />
                  <div>
                    <p className="text-xs font-bold text-text-primary">{item.test}</p>
                    <p className="text-[10px] text-text-secondary">{item.action}</p>
                    <p className="text-[9px] text-gray-300 uppercase font-black">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Test Item"
        footer={(
          <button 
            onClick={handleAddTest}
            className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-teal-500/20"
          >
            Add Test
          </button>
        )}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Test Item</label>
            <input 
              type="text" 
              value={newTest.item} 
              onChange={e => setNewTest(prev => ({...prev, item: e.target.value}))} 
              className="w-full bg-surface border border-border-dark rounded-lg py-2 px-3 text-sm outline-none focus:border-accent text-text-primary"
              placeholder="e.g. Thermal Shock"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Method / Standard</label>
            <input 
              type="text" 
              value={newTest.method} 
              onChange={e => setNewTest(prev => ({...prev, method: e.target.value}))} 
              className="w-full bg-surface border border-border-dark rounded-lg py-2 px-3 text-sm outline-none focus:border-accent text-text-primary"
              placeholder="e.g. ISO 16750-4"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Acceptance Criteria</label>
            <input 
              type="text" 
              value={newTest.criteria} 
              onChange={e => setNewTest(prev => ({...prev, criteria: e.target.value}))} 
              className="w-full bg-surface border border-border-dark rounded-lg py-2 px-3 text-sm outline-none focus:border-accent text-text-primary"
              placeholder="e.g. No cracks after 24h"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Sample ID (Optional)</label>
            <input 
              type="text" 
              value={newTest.sample} 
              onChange={e => setNewTest(prev => ({...prev, sample: e.target.value}))} 
              className="w-full bg-surface border border-border-dark rounded-lg py-2 px-3 text-sm outline-none focus:border-accent text-text-primary"
              placeholder="e.g. SN-099"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={bulkSignoffSuccess}
        onClose={() => setBulkSignoffSuccess(false)}
        title="Sign-off Complete"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-accent mb-2">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-primary">Successfully Generated</h3>
            <p className="text-sm text-text-secondary">
              All pending tests have been signed off successfully.
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => setBulkSignoffSuccess(false)}
              className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-accent/90 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DVPR
