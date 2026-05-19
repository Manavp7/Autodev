import { useState } from 'react'
import { Plus, Search, Edit2, Cpu, CheckCircle, Download } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useToast } from '../components/ui/Toast'
import { useAppStore } from '../stores/appStore'
import { downloadCSV } from '../utils/export'
import { cn } from '../lib/utils'

type MachineStatus = 'Running' | 'Stopped' | 'Maintenance' | 'Idle'

interface Machine {
  id: string; name: string; type: string; location: string
  status: MachineStatus; installDate: string; lastPm: string; nextPm: string
  asset: string; oee: number
}

const INITIAL: Machine[] = [
  { id: 'MCH-1001', name: 'CNC-Mill-01',      type: 'CNC Machine',      location: 'Line 1, Cell A', status: 'Running',     installDate: '2020-03-10', lastPm: 'Sep 15',  nextPm: 'Dec 15',  asset: 'DET04-CNC-01',  oee: 97 },
  { id: 'MCH-1002', name: 'Robot-Arm-Weld-2', type: 'Robotic Welder',   location: 'Line 1, Cell B', status: 'Running',     installDate: '2021-06-22', lastPm: 'Oct 01',  nextPm: 'Jan 01',  asset: 'DET04-RW-02',   oee: 91 },
  { id: 'MCH-1042', name: 'CNC-Mill-04',      type: 'CNC Machine',      location: 'Line 1, Cell A', status: 'Maintenance', installDate: '2020-03-10', lastPm: 'Sep 15',  nextPm: 'Dec 15',  asset: 'DET04-CNC-04',  oee: 0  },
  { id: 'MCH-1051', name: 'Press-Line-B',     type: 'Hydraulic Press',  location: 'Press Bay 2',    status: 'Stopped',     installDate: '2019-11-05', lastPm: 'Aug 20',  nextPm: 'Nov 20',  asset: 'DET04-HP-51',   oee: 0  },
  { id: 'MCH-2001', name: 'Paint-Robot-P1',   type: 'Paint Robot',      location: 'Paint Bay 1',    status: 'Running',     installDate: '2022-01-15', lastPm: 'Oct 10',  nextPm: 'Jan 10',  asset: 'DET04-PR-01',   oee: 83 },
  { id: 'MCH-2022', name: 'CMM-QC-Lab',       type: 'CMM',              location: 'QC Lab',         status: 'Idle',        installDate: '2021-09-01', lastPm: 'Sep 28',  nextPm: 'Dec 28',  asset: 'DET04-CMM-01',  oee: 72 },
]

const STATUS_CFG: Record<MachineStatus, string> = {
  Running:     'bg-success/10 border-success/20 text-success',
  Stopped:     'bg-danger/10 border-danger/20 text-danger',
  Maintenance: 'bg-surface border-border-dark text-text-secondary',
  Idle:        'bg-surface border-border-dark text-text-secondary opacity-70',
}

export function MachineRegistryPage() {
  const toast = useToast()
  const { openDetail } = useAppStore()
  const [machines, setMachines] = useState(INITIAL)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ id: '', name: '', type: 'CNC Machine', location: '', asset: '', installDate: '' })

  const filtered = machines.filter(m => {
    const matchSearch = !search || m.id.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase()) || m.location.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchSearch && matchStatus
  })

  const setStatus = (id: string, status: MachineStatus) => {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    toast(`${machines.find(m => m.id === id)?.name} status updated to ${status}`, 'success')
    setEditId(null)
  }

  const addMachine = () => {
    if (!form.id || !form.name) { toast('Machine ID and Name are required', 'error'); return }
    const newMachine: Machine = { ...form, status: 'Idle', lastPm: 'Never', nextPm: 'TBD', oee: 0 }
    setMachines(prev => [...prev, newMachine])
    toast(`Machine ${form.name} registered`, 'success')
    setShowAdd(false)
    setForm({ id: '', name: '', type: 'CNC Machine', location: '', asset: '', installDate: '' })
  }

  const handleExport = () => {
    if (!machines.length) return
    const exportData = machines.map(m => ({
      ID: m.id,
      Name: m.name,
      Type: m.type,
      Location: m.location,
      Status: m.status,
      OEE: m.oee,
      NextPM: m.nextPm,
      Asset: m.asset
    }))
    downloadCSV(exportData, `machine_registry_${new Date().getTime()}.csv`)
    toast('Exported CSV successfully', 'success')
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Page Header Pattern */}
      <div className="flex-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Cpu size={24} className="text-accent" /> Machine Registry
          </h1>
          <p className="text-xs text-text-secondary mt-1">{machines.length} registered machines Â· {machines.filter(m => m.status === 'Running').length} running</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm font-medium hover:border-accent hover:text-accent transition-all flex items-center gap-2"
          >
            <Download size={16} /> Export CSV
          </button>
          <button 
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-accent text-white rounded-md text-sm font-bold shadow-[0_0_15px_rgba(46,125,50,0.3)] hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Register Machine
          </button>
        </div>
      </div>

      <Card glass className="p-4 flex gap-3 overflow-hidden">
        <Input className="flex-1" placeholder="Search ID, name, or location..." iconLeft={<Search size={16}/>}
          value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          options={[{label:'All Status',value:'all'},{label:'Running',value:'Running'},{label:'Stopped',value:'Stopped'},{label:'Maintenance',value:'Maintenance'},{label:'Idle',value:'Idle'}]} />
        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest self-center ml-2">{filtered.length} machines</span>
      </Card>

      <Card glass className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary/50 sticky top-0 border-b border-border-dark z-10 text-[10px] font-black text-text-secondary uppercase tracking-widest">
              <tr>
                <th className="p-4 text-left">Machine ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">OEE</th>
                <th className="p-4 text-left">Next PM</th>
                <th className="p-4 text-left">Asset Tag</th>
                <th className="p-4"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {filtered.map(m => (
                <tr 
                  key={m.id} 
                  className="hover:bg-primary/50 cursor-pointer transition-colors group"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'SELECT') {
                      openDetail('MACHINE', m.id, m)
                    }
                  }}
                >
                  <td className="p-4 font-mono font-bold text-text-primary group-hover:text-accent transition-colors">{m.id}</td>
                  <td className="p-4 font-bold">{m.name}</td>
                  <td className="p-4 text-text-secondary">{m.type}</td>
                  <td className="p-4 text-text-secondary">{m.location}</td>
                  <td className="p-4 text-center">
                    {editId === m.id ? (
                      <div onClick={e => e.stopPropagation()}>
                        <Select value={m.status} onChange={e => setStatus(m.id, e.target.value as MachineStatus)}
                          options={['Running','Stopped','Maintenance','Idle'].map(v => ({label: v, value: v}))} />
                      </div>
                    ) : (
                      <span 
                        onClick={(e) => { e.stopPropagation(); setEditId(m.id) }} 
                        className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border cursor-pointer hover:opacity-80 transition-opacity", STATUS_CFG[m.status])}
                      >
                        {m.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {m.oee > 0 ? (
                      <span className={cn("font-black px-2 py-0.5 rounded-full border text-xs", m.oee >= 85 ? 'bg-success/10 text-success border-success/20' : m.oee >= 70 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-danger/10 text-danger border-danger/20')}>
                        {m.oee}%
                      </span>
                    ) : <span className="text-text-secondary">-</span>}
                  </td>
                  <td className="p-4 text-xs font-bold text-text-secondary">{m.nextPm}</td>
                  <td className="p-4 font-mono text-xs text-text-secondary">{m.asset}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation()
                          toast(`Maintenance scheduled for ${m.name}`, 'success')
                          setMachines(prev => prev.map(x => x.id === m.id ? {...x, status: 'Maintenance'} : x)) 
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-surface border border-border-dark text-text-secondary rounded-md hover:text-warning hover:border-warning/50 transition-colors"
                      >
                        Schedule PM
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showAdd && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-surface border border-border-dark rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-extrabold text-text-primary tracking-tight mb-4">Register New Machine</h2>
            <div className="space-y-3">
              <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Machine ID *</label><Input value={form.id} onChange={e => setForm(f => ({...f, id: e.target.value}))} placeholder="MCH-XXXX" /></div>
              <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Machine Name *</label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. CNC-Mill-05" /></div>
              <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Type</label>
                <Select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
                  options={['CNC Machine','Robotic Welder','Hydraulic Press','Paint Robot','CMM','Conveyor','Assembly Station','Other'].map(v => ({label: v, value: v}))} />
              </div>
              <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Location</label><Input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Line 1, Cell C" /></div>
              <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Asset Tag</label><Input value={form.asset} onChange={e => setForm(f => ({...f, asset: e.target.value}))} placeholder="DET04-XXX-XX" /></div>
              <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Install Date</label><Input type="date" value={form.installDate} onChange={e => setForm(f => ({...f, installDate: e.target.value}))} /></div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-border-dark">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={addMachine}>Register</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
