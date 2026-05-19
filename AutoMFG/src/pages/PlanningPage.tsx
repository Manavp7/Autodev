import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Download, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'

const WEEKS = [
  { label: 'Oct 9 - Oct 15', tag: 'Wk 41' },
  { label: 'Oct 16 - Oct 22', tag: 'Wk 42' },
  { label: 'Oct 23 - Oct 29', tag: 'Wk 43' },
  { label: 'Oct 30 - Nov 5', tag: 'Wk 44' },
]

const LINES = ['All Lines', 'Line Alpha / Engines', 'Line Beta / Transmissions', 'Line Gamma / Assembly']

const SHIFTS = [
  { day: 'Mon 16', s: ['Custom Order', '', 'High Volume'] },
  { day: 'Tue 17', s: ['', 'Hybrid Setup', ''] },
  { day: 'Wed 18', s: ['High Volume', 'High Volume', 'High Volume'] },
  { day: 'Thu 19', s: ['', '', ''] },
  { day: 'Fri 20', s: ['Maintenance', '', ''] },
  { day: 'Sat 21', s: ['', '', ''] },
]

const COLORS: Record<string, string> = {
  'High Volume': 'bg-blue-200 text-blue-800',
  'Hybrid Setup': 'bg-green-200 text-green-800',
  'Custom Order': 'bg-orange-200 text-orange-800',
  'Maintenance': 'bg-pink-200 text-pink-800',
}

const INITIAL_MATERIALS = [
  { id: 'PT-882-A', desc: 'Housing Cast V8', required: 450, onHand: 120, status: 'SHORTAGE', impact: 'Impacts Line Alpha S2' },
  { id: 'EL-901-X', desc: 'Sensor Array Kit', required: 1200, onHand: 1250, status: 'LOW STOCK', impact: 'Delivery delayed to Wed' },
]

const CAPACITY = [
  { line: 'Line Alpha (Engines)', pct: 92, color: 'bg-green-500' },
  { line: 'Line Beta (Trans)', pct: 65, color: 'bg-orange-400', note: '*Reduced cap due to Maint.' },
  { line: 'Line Gamma (Assy)', pct: 88, color: 'bg-green-500' },
]

export function PlanningPage() {
  const toast = useToast()
  const [weekIdx, setWeekIdx] = useState(1)
  const [selectedLine, setSelectedLine] = useState('All Lines')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', line: 'Line Alpha / Engines', shift: 'S1', type: 'High Volume', notes: '' })
  const [materials, setMaterials] = useState(INITIAL_MATERIALS)

  const week = WEEKS[weekIdx]

  const handleCreate = () => {
    if (!form.title) { toast('Enter a plan title', 'error'); return }
    toast(`Production plan "${form.title}" created for ${form.line}`, 'success')
    setShowModal(false)
    setForm({ title: '', line: 'Line Alpha / Engines', shift: 'S1', type: 'High Volume', notes: '' })
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="text-heading-xl">Production Schedule</h1>
          <p className="text-body text-text-secondary">Weekly plan & material availability</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" iconLeft={<Download size={16}/>} onClick={() => toast('Schedule exported to ERP format', 'success')}>
            Import from ERP
          </Button>
          <Button variant="primary" iconLeft={<Plus size={16}/>} onClick={() => setShowModal(true)}>
            Create New Plan
          </Button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-heading-md mb-4">Create New Production Plan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-medium mb-1">Plan Title *</label>
                <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Wk 43 High Volume Run" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-medium mb-1">Line</label>
                  <Select value={form.line} onChange={e => setForm(f => ({...f, line: e.target.value}))}
                    options={LINES.slice(1).map(l => ({label: l, value: l}))} />
                </div>
                <div>
                  <label className="block text-body-sm font-medium mb-1">Type</label>
                  <Select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
                    options={['High Volume','Hybrid Setup','Custom Order','Maintenance'].map(v => ({label: v, value: v}))} />
                </div>
              </div>
              <div>
                <label className="block text-body-sm font-medium mb-1">Notes</label>
                <Textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={3} placeholder="Additional notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreate}>Create Plan</Button>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-text-secondary">{week.tag}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setWeekIdx(i => Math.max(0, i-1))} disabled={weekIdx === 0}
                className="p-1 rounded hover:bg-surface disabled:opacity-30 transition-colors"><ChevronLeft size={18}/></button>
              <span className="text-body font-medium px-2">{week.label}</span>
              <button onClick={() => setWeekIdx(i => Math.min(WEEKS.length-1, i+1))} disabled={weekIdx === WEEKS.length-1}
                className="p-1 rounded hover:bg-surface disabled:opacity-30 transition-colors"><ChevronRight size={18}/></button>
            </div>
          </div>
          <Select value={selectedLine} onChange={e => setSelectedLine(e.target.value)}
            options={LINES.map(l => ({label: l, value: l}))} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-body-xs border-collapse">
            <thead>
              <tr className="text-text-muted">
                <th className="text-left p-2 font-medium w-40">Line / Workcell</th>
                {SHIFTS.map(s => (
                  <th key={s.day} colSpan={3} className="text-center p-1 border-l border-border font-medium">{s.day}</th>
                ))}
              </tr>
              <tr className="text-text-muted text-center">
                <th/>
                {SHIFTS.map(s => ['S1','S2','S3'].map(sh => (
                  <th key={`${s.day}-${sh}`} className="p-1 w-12 border-l border-border font-normal">{sh}</th>
                )))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(selectedLine === 'All Lines' ? LINES.slice(1) : [selectedLine]).map((line, li) => (
                <tr key={line}>
                  <td className="p-2 font-medium text-body-sm">{line}</td>
                  {SHIFTS.map((s, si) => s.s.map((cell, ci) => (
                    <td key={`${si}-${ci}`} className="p-1 border-l border-border">
                      {cell && (
                        <div className={`text-center py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80 ${COLORS[cell]}`}
                          onClick={() => toast(`${cell} shift selected: ${line} - ${s.day} S${ci+1}`, 'info')}>
                          {cell.split(' ')[0]}
                        </div>
                      )}
                    </td>
                  )))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 mt-3 pt-3 border-t border-border">
          {Object.entries(COLORS).map(([label, cls]) => (
            <span key={label} className="flex items-center gap-1.5 text-body-xs">
              <span className={`w-3 h-3 rounded ${cls.split(' ')[0]}`}/>
              {label}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-5">
        {/* Material Watchlist */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-heading-sm flex items-center gap-2"><AlertTriangle size={16} className="text-orange-500"/> Material Availability Watchlist</h3>
            <button onClick={() => toast('Navigating to full shortage report...', 'info')}
              className="text-forest-600 hover:underline text-body-sm font-medium">View All Shortages</button>
          </div>
          <table className="w-full text-body-sm">
            <thead className="text-label text-text-muted uppercase border-b border-border">
              <tr>
                <th className="p-2 text-left">Part ID</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Required</th>
                <th className="p-2 text-right">On Hand</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {materials.map(m => (
                <tr key={m.id} className="hover:bg-surface">
                  <td className="p-2 font-mono text-xs">{m.id}</td>
                  <td className="p-2">{m.desc}</td>
                  <td className="p-2 text-right">{m.required.toLocaleString()}</td>
                  <td className={`p-2 text-right font-bold ${m.onHand < m.required ? 'text-red-600' : 'text-orange-600'}`}>{m.onHand.toLocaleString()}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => toast(`Expedite request raised for ${m.id}`, 'success')}
                      className={`px-2 py-0.5 rounded text-xs font-bold hover:opacity-80 transition-opacity ${m.status === 'SHORTAGE' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {m.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Capacity */}
        <Card className="p-4">
          <h3 className="text-heading-sm mb-4">Capacity Utilization ({week.tag})</h3>
          <div className="space-y-5">
            {CAPACITY.map(c => (
              <div key={c.line}>
                <div className="flex justify-between text-body-sm font-medium mb-1">
                  <span>{c.line}</span>
                  <span>{c.pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${c.color}`} style={{ width: `${c.pct}%` }}/>
                </div>
                {c.note && <p className="text-body-xs text-orange-600 mt-0.5">{c.note}</p>}
              </div>
            ))}
          </div>
          <button onClick={() => toast('Capacity report downloaded', 'success')}
            className="mt-4 w-full border border-border rounded-lg py-2 text-body-sm text-text-secondary hover:bg-surface transition-colors">
            Export Capacity Report
          </button>
        </Card>
      </div>
    </div>
  )
}
