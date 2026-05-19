import { useState } from 'react'
import { Plus, Search, Download, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'

type Disposition = 'scrap' | 'rework' | 'pending'
interface Entry { id: string; partNumber: string; wo: string; station: string; type: string; qty: number; disposition: Disposition; loggedBy: string; time: string; cost: number; action?: string }

const INITIAL: Entry[] = [
  { id: 'SR-0042', partNumber: 'PT-902A',         wo: 'WO-44922-Y', station: 'Stamping Line',  type: 'Surface Scratch',        qty: 1,  disposition: 'scrap',   loggedBy: 'M. Rossi',  time: '10:30 AM', cost: 320 },
  { id: 'SR-0043', partNumber: '1G1YD2E0XN5100',  wo: 'WO-44921-X', station: 'Paint Cell 2',   type: 'Paint Inclusion',        qty: 1,  disposition: 'rework',  loggedBy: 'M. Rossi',  time: '09:45 AM', cost: 85 },
  { id: 'SR-0044', partNumber: 'BAT-110',          wo: 'WO-44923-Z', station: 'Sub-Assy B',     type: 'Dimensional Variance',   qty: 12, disposition: 'scrap',   loggedBy: 'A. Smith',  time: '08:20 AM', cost: 1200 },
  { id: 'SR-0045', partNumber: 'EL-884B',          wo: 'WO-44923-Z', station: 'STN-020',        type: 'Missing Torque Spec',    qty: 2,  disposition: 'pending', loggedBy: 'A. Smith',  time: '11:05 AM', cost: 450 },
]

export function ScrapReworkPage() {
  const toast = useToast()
  const [entries, setEntries] = useState<Entry[]>(INITIAL)
  const [search, setSearch] = useState('')
  const [dispFilter, setDispFilter] = useState('all')
  const [showLog, setShowLog] = useState(false)
  const [form, setForm] = useState({ partNumber: '', wo: '', station: '', type: '', qty: '1', disposition: 'scrap' as Disposition, notes: '' })

  const filtered = entries.filter(e => {
    const matchSearch = !search || e.partNumber.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
    const matchDisp = dispFilter === 'all' || e.disposition === dispFilter
    return matchSearch && matchDisp
  })

  const setDisposition = (id: string, disposition: Disposition) => {
    setEntries(prev => prev.map(e => e.id === id ? {...e, disposition} : e))
    toast(`Disposition set to ${disposition}`, 'success')
  }

  const logEntry = () => {
    if (!form.partNumber || !form.type) { toast('Part number and defect type are required', 'error'); return }
    const newEntry: Entry = {
      id: `SR-${String(entries.length + 46).padStart(4, '0')}`,
      partNumber: form.partNumber, wo: form.wo, station: form.station,
      type: form.type, qty: parseInt(form.qty) || 1, disposition: form.disposition,
      loggedBy: 'Current User', time: new Date().toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'}),
      cost: 0,
    }
    setEntries(prev => [newEntry, ...prev])
    toast(`Scrap/Rework entry ${newEntry.id} logged`, 'success')
    setShowLog(false)
    setForm({ partNumber: '', wo: '', station: '', type: '', qty: '1', disposition: 'scrap', notes: '' })
  }

  const totalScrap = entries.filter(e => e.disposition === 'scrap').reduce((s, e) => s + e.cost, 0)
  const totalRework = entries.filter(e => e.disposition === 'rework').reduce((s, e) => s + e.cost, 0)

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">Scrap & Rework Log</h1>
          <p className="text-body text-text-secondary">Non-conformance cost tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" iconLeft={<Download size={16}/>} onClick={() => toast('Scrap report exported', 'success')}>Export</Button>
          <Button variant="primary" iconLeft={<Plus size={16}/>} onClick={() => setShowLog(true)}>Log Entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Scrap Cost Today',  value: `$${totalScrap.toLocaleString()}`, color: 'text-red-600' },
          { label: 'Rework Cost Today', value: `$${totalRework.toLocaleString()}`, color: 'text-orange-600' },
          { label: 'Total Cost',        value: `$${(totalScrap+totalRework).toLocaleString()}`, color: 'text-text-primary' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="text-label uppercase text-text-muted mb-1">{s.label}</div>
            <div className={`text-kpi font-bold leading-none ${s.color}`}>{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4 flex gap-3">
        <Input className="flex-1" placeholder="Search part number or SR ID..." iconLeft={<Search size={16}/>}
          value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={dispFilter} onChange={e => setDispFilter(e.target.value)}
          options={[{label:'All',value:'all'},{label:'Scrap',value:'scrap'},{label:'Rework',value:'rework'},{label:'Pending',value:'pending'}]} />
      </Card>

      <Card className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-body-sm">
            <thead className="bg-surface sticky top-0 border-b border-border text-label text-text-muted uppercase">
              <tr>
                <th className="p-3 text-left">SR ID</th>
                <th className="p-3 text-left">PART NUMBER</th>
                <th className="p-3 text-left">WORK ORDER</th>
                <th className="p-3 text-left">DEFECT TYPE</th>
                <th className="p-3 text-center">QTY</th>
                <th className="p-3 text-right">COST</th>
                <th className="p-3 text-left">LOGGED BY</th>
                <th className="p-3 text-left">DISPOSITION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-text-muted">No entries found.</td></tr>}
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-surface">
                  <td className="p-3 font-mono text-forest-600">{e.id}</td>
                  <td className="p-3 font-mono">{e.partNumber}</td>
                  <td className="p-3 text-text-secondary">{e.wo}</td>
                  <td className="p-3">{e.type}</td>
                  <td className="p-3 text-center font-bold">{e.qty}</td>
                  <td className="p-3 text-right font-medium">{e.cost > 0 ? `$${e.cost.toLocaleString()}` : '—'}</td>
                  <td className="p-3 text-text-secondary">{e.loggedBy}</td>
                  <td className="p-3">
                    {e.disposition === 'pending' ? (
                      <div className="flex gap-1">
                        <button onClick={() => setDisposition(e.id, 'scrap')}
                          className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold hover:bg-red-200 transition-colors">Scrap</button>
                        <button onClick={() => setDisposition(e.id, 'rework')}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold hover:bg-blue-200 transition-colors">Rework</button>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${e.disposition === 'scrap' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {e.disposition.toUpperCase()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLog(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-heading-md mb-4">Log Scrap / Rework Entry</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-body-sm font-medium mb-1">Part Number *</label><Input value={form.partNumber} onChange={e => setForm(f => ({...f, partNumber: e.target.value}))} placeholder="PT-XXXX" /></div>
                <div><label className="block text-body-sm font-medium mb-1">Work Order</label><Input value={form.wo} onChange={e => setForm(f => ({...f, wo: e.target.value}))} placeholder="WO-XXXXX" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-body-sm font-medium mb-1">Station</label><Input value={form.station} onChange={e => setForm(f => ({...f, station: e.target.value}))} placeholder="e.g. STN-030" /></div>
                <div><label className="block text-body-sm font-medium mb-1">Qty</label><Input type="number" value={form.qty} onChange={e => setForm(f => ({...f, qty: e.target.value}))} /></div>
              </div>
              <div><label className="block text-body-sm font-medium mb-1">Defect Type *</label>
                <Select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
                  options={['Surface Scratch','Dimensional Variance','Paint Defect','Missing Feature','Torque Non-conformance','Electrical Fault','Other'].map(v => ({label: v, value: v}))} />
              </div>
              <div><label className="block text-body-sm font-medium mb-1">Disposition</label>
                <div className="flex gap-2">
                  {(['scrap','rework','pending'] as Disposition[]).map(d => (
                    <button key={d} onClick={() => setForm(f => ({...f, disposition: d}))}
                      className={`flex-1 py-2 rounded-lg border text-[13px] leading-[20px] font-medium capitalize transition-colors ${form.disposition === d ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'border-border-dark text-text-secondary hover:bg-primary'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="block text-body-sm font-medium mb-1">Notes</label><Textarea rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Additional context..." /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setShowLog(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={logEntry}>Log Entry</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
