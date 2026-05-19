import { useState } from 'react'
import { CheckCircle, AlertTriangle, Clock, User, Clipboard, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'

const INITIAL_ITEMS = [
  { id: 1, category: 'Quality', text: 'Paint cell 2 primer temp running 2°C low. Watch during next run.', severity: 'warning', acknowledged: false },
  { id: 2, category: 'Safety', text: 'Spill in Paint Bay aisle cleared. Area marked for floor repair.', severity: 'ok', acknowledged: false },
  { id: 3, category: 'Production', text: 'WO-44921 short by 55 units. Schedule adjustment required for Shift B.', severity: 'warning', acknowledged: false },
  { id: 4, category: 'Maintenance', text: 'CNC-Mill-04 spindle fault repaired. Monitor for first 2h of Shift B.', severity: 'ok', acknowledged: false },
  { id: 5, category: 'Staffing', text: 'STN-030 operator absent. OP-8802 cross-trained and covering.', severity: 'info', acknowledged: false },
]

const INITIAL_OPEN = {
  machines: 'Paint Line B stopped – Robot Arm Fault, Stn 4. Mike Kim assigned.',
  parts: 'PT-882-A shortage – expedite PO raised (ETA Wednesday 6 AM).',
  quality: 'D-8824 paint inclusion NCR open – pending disposition.',
  safety: 'No open safety items.',
}

export function ShiftHandoverPage() {
  const toast = useToast()
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [open, setOpen] = useState(INITIAL_OPEN)
  const [incomingNotes, setIncomingNotes] = useState('')
  const [outgoingNotes, setOutgoingNotes] = useState('')
  const [incomingName, setIncomingName] = useState('')
  const [shiftFrom, setShiftFrom] = useState('A')
  const [shiftTo, setShiftTo] = useState('B')
  const [submitted, setSubmitted] = useState(false)
  const [addingItem, setAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({ category: 'Quality', text: '', severity: 'info' })

  const acknowledge = (id: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, acknowledged: true } : it))
    toast('Item acknowledged', 'success')
  }

  const addHandoverItem = () => {
    if (!newItem.text) { toast('Enter item description', 'error'); return }
    setItems(prev => [...prev, { ...newItem, id: Date.now(), acknowledged: false }])
    setNewItem({ category: 'Quality', text: '', severity: 'info' })
    setAddingItem(false)
    toast('Handover item added', 'success')
  }

  const submit = () => {
    if (!incomingName) { toast('Enter incoming supervisor name', 'error'); return }
    setSubmitted(true)
    toast(`Shift ${shiftFrom}→${shiftTo} handover signed off successfully`, 'success')
  }

  const severityConfig = {
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
    ok:      'bg-green-50 border-green-300 text-green-800',
    info:    'bg-blue-50 border-blue-300 text-blue-800',
    error:   'bg-red-50 border-red-300 text-red-800',
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">Shift Handover</h1>
          <div className="flex items-center gap-3 mt-1">
            <Select value={shiftFrom} onChange={e => setShiftFrom(e.target.value)}
              options={['A','B','C'].map(s => ({label: `Shift ${s} (Outgoing)`, value: s}))} />
            <span className="text-text-muted">→</span>
            <Select value={shiftTo} onChange={e => setShiftTo(e.target.value)}
              options={['A','B','C'].filter(s => s !== shiftFrom).map(s => ({label: `Shift ${s} (Incoming)`, value: s}))} />
          </div>
        </div>
        {submitted ? (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
            <CheckCircle size={18}/> Handover Complete
          </div>
        ) : (
          <Button variant="primary" iconLeft={<CheckCircle size={16}/>} onClick={submit}>
            Submit & Sign-off
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
        {/* LEFT: Outgoing notes + open items */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <Card className="p-4">
            <h3 className="text-heading-sm mb-3 flex items-center gap-2"><Clipboard size={16}/> Outgoing Supervisor Notes</h3>
            <Textarea rows={4} placeholder="Notes for incoming shift..." value={outgoingNotes} onChange={e => setOutgoingNotes(e.target.value)} />
          </Card>

          <Card className="p-4">
            <h3 className="text-heading-sm mb-3">Open Items Requiring Attention</h3>
            <div className="space-y-3">
              {(['machines','parts','quality','safety'] as const).map(key => (
                <div key={key}>
                  <label className="block text-label uppercase text-text-muted mb-1">{key}</label>
                  <Textarea rows={2} value={open[key]} onChange={e => setOpen(prev => ({...prev, [key]: e.target.value}))} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-heading-sm">Handover Checklist ({items.filter(i => i.acknowledged).length}/{items.length})</h3>
              <button onClick={() => setAddingItem(true)} className="flex items-center gap-1 text-forest-600 hover:underline text-body-sm">
                <Plus size={14}/> Add item
              </button>
            </div>
            {addingItem && (
              <div className="mb-3 bg-surface rounded-lg p-3 border border-border space-y-2">
                <Select value={newItem.category} onChange={e => setNewItem(p => ({...p, category: e.target.value}))}
                  options={['Quality','Safety','Production','Maintenance','Staffing','Other'].map(v => ({label: v, value: v}))} />
                <Input value={newItem.text} onChange={e => setNewItem(p => ({...p, text: e.target.value}))} placeholder="Item description..." />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setAddingItem(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={addHandoverItem}>Add</Button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className={`border rounded-lg p-3 flex items-start gap-3 ${item.acknowledged ? 'opacity-50' : severityConfig[item.severity as keyof typeof severityConfig]}`}>
                  <span className="text-xs font-bold bg-white/60 px-1.5 py-0.5 rounded uppercase mt-0.5">{item.category}</span>
                  <p className="text-body-sm flex-1">{item.text}</p>
                  {!item.acknowledged ? (
                    <button onClick={() => acknowledge(item.id)}
                      className="shrink-0 text-xs px-2 py-1 bg-white/60 hover:bg-white rounded font-medium transition-colors">
                      Ack ✓
                    </button>
                  ) : (
                    <CheckCircle size={16} className="text-green-600 shrink-0"/>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT: Incoming sign-off */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <h3 className="text-heading-sm mb-3 flex items-center gap-2"><User size={16}/> Incoming Supervisor Sign-off</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-medium mb-1">Name / Badge ID *</label>
                <Input value={incomingName} onChange={e => setIncomingName(e.target.value)} placeholder="Incoming supervisor name..." />
              </div>
              <div>
                <label className="block text-body-sm font-medium mb-1">Notes / Concerns</label>
                <Textarea rows={4} value={incomingNotes} onChange={e => setIncomingNotes(e.target.value)} placeholder="Any concerns or instructions received..." />
              </div>
            </div>
          </Card>

          {submitted && (
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="text-center">
                <CheckCircle size={48} className="text-green-600 mx-auto mb-3"/>
                <h3 className="text-heading-md text-green-800">Handover Signed Off</h3>
                <p className="text-body text-green-700 mt-1">Shift {shiftFrom} → Shift {shiftTo} handover recorded at {new Date().toLocaleTimeString()}</p>
                <p className="text-body-sm text-green-600 mt-2">Incoming: {incomingName}</p>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="text-heading-sm mb-3 flex items-center gap-2"><Clock size={16}/> Production Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Units Produced', value: '1,087', sub: 'Target: 1,200' },
                { label: 'OEE', value: '87.4%', sub: 'Target: 85%' },
                { label: 'Andon Events', value: '3', sub: '1 critical' },
                { label: 'Downtime', value: '42 min', sub: 'Paint Line B' },
              ].map(s => (
                <div key={s.label} className="bg-surface rounded-lg p-3 border border-border">
                  <div className="text-label uppercase text-text-muted">{s.label}</div>
                  <div className="text-kpi font-bold text-text-primary">{s.value}</div>
                  <div className="text-body-xs text-text-muted">{s.sub}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
