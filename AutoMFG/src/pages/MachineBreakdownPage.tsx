import { useState } from 'react'
import { Plus, Clock, CheckCircle, Search, Wrench } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { maintenanceApi } from '@/api'
import { useToast } from '@/components/ui/Toast'
import type { Breakdown, BreakdownStatus } from '@/types'

const PRIORITY_COLORS: Record<string, string> = {
  p1: 'bg-red-800 text-white',
  p2: 'bg-red-500 text-white',
  p3: 'bg-orange-500 text-white',
  p4: 'bg-gray-400 text-white',
}

const STATUS_COLORS: Record<BreakdownStatus, string> = {
  open: 'bg-red-100 text-red-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  escalated: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
}

function elapsed(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `${m}m`
  return `${Math.floor(m/60)}h ${m%60}m`
}

const BLANK_FORM = {
  machineName: '', machineId: '', location: '', priority: 'p2' as 'p1'|'p2'|'p3'|'p4',
  title: '', description: '', reportedBy: '', faultCode: '',
}

export function MachineBreakdownPage() {
  const qc = useQueryClient()
  const toast = useToast()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showLog, setShowLog] = useState(false)
  const [form, setForm] = useState(BLANK_FORM)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const { data: allBreakdowns = [], isLoading } = useQuery({
    queryKey: ['breakdowns'],
    queryFn: maintenanceApi.getBreakdowns,
    refetchInterval: 15000,
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BreakdownStatus }) =>
      maintenanceApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['breakdowns'] })
      toast('Breakdown status updated', 'success')
    },
  })

  const logBreakdown = useMutation({
    mutationFn: (payload: any) => maintenanceApi.createBreakdown(payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['breakdowns'] })
      toast(`Breakdown ticket ${data?.id} created`, 'success')
      setShowLog(false)
      setForm(BLANK_FORM)
      setSelectedId(data?.id ?? null)
    },
    onError: () => toast('Failed to log breakdown', 'error'),
  })

  const handleSubmit = () => {
    if (!form.machineName || !form.title) {
      toast('Machine name and fault title are required', 'error')
      return
    }
    logBreakdown.mutate({ ...form, reportedBy: form.reportedBy || 'Current User' })
  }

  const breakdowns = (allBreakdowns as Breakdown[]).filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()) || b.machineName.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const selected: Breakdown | undefined = breakdowns.find(b => b.id === selectedId) ?? breakdowns[0]
  const active = (allBreakdowns as Breakdown[]).filter(b => b.status !== 'resolved')

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl flex items-center gap-3">
            Machine Breakdowns
            {active.length > 0 && <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">{active.length} ACTIVE</span>}
          </h1>
          <p className="text-body text-text-secondary">Maintenance Ticket Management & Parts Allocation</p>
        </div>
        <Button variant="danger" iconLeft={<Plus size={16}/>} onClick={() => setShowLog(true)}>Log Breakdown</Button>
      </div>

      {/* Log Breakdown Modal */}
      {showLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLog(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-heading-md mb-1 flex items-center gap-2"><Wrench size={18} className="text-red-600"/>Log Machine Breakdown</h2>
            <p className="text-body-sm text-text-secondary mb-5">Creates a maintenance ticket and notifies assigned technicians.</p>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-body-sm font-medium mb-1">Machine Name *</label><Input value={form.machineName} onChange={e => setForm(f => ({...f, machineName: e.target.value}))} placeholder="e.g. CNC-Mill-04"/></div>
              <div><label className="block text-body-sm font-medium mb-1">Machine ID</label><Input value={form.machineId} onChange={e => setForm(f => ({...f, machineId: e.target.value}))} placeholder="MCH-XXXX"/></div>
              <div><label className="block text-body-sm font-medium mb-1">Location</label><Input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Line 1, Cell A"/></div>
              <div><label className="block text-body-sm font-medium mb-1">Fault Code</label><Input value={form.faultCode} onChange={e => setForm(f => ({...f, faultCode: e.target.value}))} placeholder="e.g. E-044"/></div>
              <div className="col-span-2"><label className="block text-body-sm font-medium mb-1">Fault Title *</label><Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Brief description of the fault"/></div>
              <div className="col-span-2"><label className="block text-body-sm font-medium mb-1">Description</label><Textarea rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Detailed fault description, symptoms observed..."/></div>
              <div><label className="block text-body-sm font-medium mb-1">Priority</label>
                <Select value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value as any}))}
                  options={[{label:'P1 – Critical',value:'p1'},{label:'P2 – High',value:'p2'},{label:'P3 – Medium',value:'p3'},{label:'P4 – Low',value:'p4'}]}/>
              </div>
              <div><label className="block text-body-sm font-medium mb-1">Reported By</label><Input value={form.reportedBy} onChange={e => setForm(f => ({...f, reportedBy: e.target.value}))} placeholder="Your name / badge"/></div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowLog(false)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={handleSubmit} disabled={logBreakdown.isPending}>
                {logBreakdown.isPending ? 'Creating Ticket…' : 'Log Breakdown'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className="p-3 flex gap-3">
        <Input className="flex-1" placeholder="Search ticket, machine..." iconLeft={<Search size={16}/>} value={search} onChange={e => setSearch(e.target.value)}/>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          options={[{label:'All',value:'all'},{label:'Open',value:'open'},{label:'In Progress',value:'in_progress'},{label:'Escalated',value:'escalated'},{label:'Resolved',value:'resolved'}]}/>
      </Card>

      <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
        {/* LEFT: Ticket List */}
        <Card className="col-span-1 flex flex-col p-0">
          <div className="p-3 border-b border-border text-label uppercase text-text-muted bg-surface font-medium">
            {statusFilter === 'all' ? `All Tickets (${breakdowns.length})` : `${statusFilter} (${breakdowns.length})`}
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border scrollbar-hide">
            {isLoading && <p className="p-6 text-center text-text-muted">Loading…</p>}
            {!isLoading && breakdowns.length === 0 && <p className="p-6 text-center text-text-muted text-body-sm">No tickets match your filter.</p>}
            {breakdowns.map(b => (
              <div key={b.id} onClick={() => setSelectedId(b.id)}
                className={`p-4 cursor-pointer hover:bg-surface transition-colors border-l-4 ${b.slaBreached ? 'border-l-red-600 bg-red-50/30' : 'border-l-transparent'} ${(selectedId ?? breakdowns[0]?.id) === b.id ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${PRIORITY_COLORS[b.priority]}`}>{b.priority.toUpperCase()}</span>
                  <span className="text-body-xs text-text-muted font-mono">{b.id}</span>
                </div>
                <div className="font-semibold text-body mb-1 line-clamp-1">{b.title}</div>
                <div className="flex items-center justify-between">
                  <span className="text-body-xs text-text-muted">{b.machineName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_COLORS[b.status]}`}>{b.status.replace('_',' ')}</span>
                </div>
                <div className="flex items-center gap-1 text-body-xs text-text-muted mt-1">
                  <Clock size={11}/> {elapsed(b.reportedAt)} elapsed
                  {b.slaBreached && <span className="text-red-600 font-bold ml-1">• SLA BREACHED</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* RIGHT: Detail */}
        <Card className="col-span-2 flex flex-col p-0 overflow-y-auto">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-3">
              <Wrench size={40} className="opacity-30"/>
              <p>Select a ticket to view details, or log a new breakdown</p>
            </div>
          ) : (
            <>
              <div className={`p-5 rounded-t-lg text-white ${selected.priority === 'p1' ? 'bg-red-700' : selected.priority === 'p2' ? 'bg-red-500' : 'bg-orange-500'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-white/20 text-label px-2 py-1 rounded uppercase">{selected.priority} – {selected.faultCode ?? 'N/A'}</span>
                  <span className="font-mono font-medium">{selected.id}</span>
                </div>
                <h2 className="text-heading-lg font-bold">{selected.title}</h2>
                <div className="flex items-center gap-4 text-white/80 text-body-sm mt-1">
                  <span>{selected.machineName}</span><span>·</span>
                  <span>{selected.location}</span><span>·</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {elapsed(selected.reportedAt)} elapsed</span>
                  {selected.slaBreached && <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">SLA BREACHED</span>}
                </div>
              </div>

              <div className="p-5 grid grid-cols-2 gap-5 border-b border-border">
                <div>
                  <div className="text-label uppercase text-text-muted mb-2">STATUS</div>
                  <Select
                    value={selected.status}
                    onChange={e => updateStatus.mutate({ id: selected.id, status: e.target.value as BreakdownStatus })}
                    options={[
                      {label: 'Open', value: 'open'},
                      {label: 'In Progress', value: 'in_progress'},
                      {label: 'Escalated', value: 'escalated'},
                      {label: 'Resolved', value: 'resolved'},
                    ]}
                  />
                </div>
                <div>
                  <div className="text-label uppercase text-text-muted mb-2">ASSIGNED TO</div>
                  <div className="border border-border rounded-lg px-3 py-2 text-body font-medium">
                    {selected.assignedTo ?? <span className="text-text-muted italic">Unassigned</span>}
                  </div>
                </div>
              </div>

              <div className="p-5 border-b border-border">
                <div className="text-label uppercase text-text-muted mb-2">FAULT DESCRIPTION</div>
                <div className="bg-surface rounded-lg p-4 border border-border text-body">{selected.description}</div>
              </div>

              <div className="p-5">
                <div className="text-label uppercase text-text-muted mb-3">PARTS REQUIRED ({selected.partsRequired.length})</div>
                {selected.partsRequired.length === 0 && <p className="text-body-sm text-text-muted italic">No parts required.</p>}
                <div className="space-y-2">
                  {selected.partsRequired.map(part => (
                    <div key={part.partNumber} className="flex items-center justify-between bg-surface rounded-lg p-3 border border-border">
                      <div>
                        <div className="font-medium text-body">{part.description}</div>
                        <div className="font-mono text-body-xs text-text-muted">{part.partNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-body-sm font-medium">Need: {part.qty}</div>
                        <div className={`text-body-xs font-medium ${part.onHand >= part.qty ? 'text-green-600' : 'text-red-600'}`}>
                          On Hand: {part.onHand} {part.onHand < part.qty && '⚠ SHORT'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 border-t border-border flex justify-between items-center mt-auto bg-surface/30">
                <div className="text-body-sm text-text-muted">
                  Reported by: <span className="font-medium text-text-primary">{selected.reportedBy}</span>
                </div>
                {selected.status !== 'resolved' && (
                  <div className="flex gap-3">
                    {selected.status === 'open' && (
                      <Button variant="outline" onClick={() => updateStatus.mutate({ id: selected.id, status: 'in_progress' })} disabled={updateStatus.isPending}>
                        Start Work
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      iconLeft={<CheckCircle size={16}/>}
                      onClick={() => updateStatus.mutate({ id: selected.id, status: 'resolved' })}
                      disabled={updateStatus.isPending}
                    >
                      {updateStatus.isPending ? 'Saving…' : 'Mark Resolved'}
                    </Button>
                  </div>
                )}
                {selected.status === 'resolved' && (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle size={18}/> Resolved
                  </div>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
