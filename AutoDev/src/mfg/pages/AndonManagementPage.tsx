import { useState } from 'react'
import { Clock, CheckCircle, User, AlertTriangle, Zap, Box, ShieldAlert, Plus, Search } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { useToast } from '../components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { andonApi } from '../api'
import type { AndonEvent } from '../types'

const TYPE_CONFIG: Record<string, { label: string; icon: any; bg: string; text: string }> = {
  fault:    { label: 'Machine Fault',    icon: AlertTriangle, bg: 'bg-amber-100', text: 'text-amber-700' },
  quality:  { label: 'Quality Defect',  icon: ShieldAlert,   bg: 'bg-purple-100', text: 'text-purple-700' },
  shortage: { label: 'Part Shortage',   icon: Box,           bg: 'bg-blue-100',  text: 'text-blue-700' },
  safety:   { label: 'Safety',          icon: AlertTriangle, bg: 'bg-red-100',   text: 'text-red-700' },
  time:     { label: 'Takt Time',       icon: Clock,         bg: 'bg-orange-100',text: 'text-orange-600' },
  handover: { label: 'Handover',        icon: Zap,           bg: 'bg-blue-100',  text: 'text-blue-600' },
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high:     'bg-orange-500 text-white',
  medium:   'bg-yellow-400 text-black',
  low:      'bg-gray-300 text-gray-800',
}

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

function slaLabel(event: AndonEvent) {
  if (event.status === 'resolved') return null
  const elapsed = Math.floor((Date.now() - new Date(event.raisedAt).getTime()) / 60000)
  const remaining = event.slaMinutes - elapsed
  if (remaining < 0) return <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded flex items-center gap-1"><Clock size={11} className="animate-pulse"/> {Math.abs(remaining)}m breached</span>
  return <span className={`font-medium px-2 py-0.5 rounded flex items-center gap-1 ${remaining < 5 ? 'text-red-600' : remaining < 15 ? 'text-orange-600' : 'text-green-600'}`}><Clock size={11}/> {remaining}m left</span>
}

export function AndonManagementPage() {
  const qc = useQueryClient()
  const toast = useToast()
  const [tab, setTab] = useState<'open' | 'resolved'>('open')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rootCause, setRootCause] = useState('')
  const [actionTaken, setActionTaken] = useState('')
  const [showRaise, setShowRaise] = useState(false)
  const [raiseForm, setRaiseForm] = useState({ title: '', type: 'fault', priority: 'high', lineId: 'l1', description: '' })

  const { data } = useQuery({
    queryKey: ['andon', tab],
    queryFn: () => andonApi.getAll({ status: tab === 'open' ? 'open' : 'resolved' }),
    refetchInterval: 10000,
  })

  const acknowledge = useMutation({
    mutationFn: (id: string) => andonApi.acknowledge(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['andon'] }); toast('Andon acknowledged', 'success') },
  })

  const resolve = useMutation({
    mutationFn: ({ id, rc, at }: { id: string; rc: string; at: string }) =>
      andonApi.resolve(id, { rootCause: rc, actionTaken: at }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['andon'] }); setRootCause(''); setActionTaken(''); setSelectedId(null); toast('Andon resolved successfully', 'success') },
  })

  const raise = useMutation({
    mutationFn: () => andonApi.raise(raiseForm as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['andon'] }); setShowRaise(false); setRaiseForm({ title: '', type: 'fault', priority: 'high', lineId: 'l1', description: '' }); toast('Andon raised successfully', 'success') },
  })

  const events: AndonEvent[] = (data?.data ?? []).filter((e: AndonEvent) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
  )
  const selected = events.find(e => e.id === selectedId) ?? events[0] ?? null

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl flex items-center gap-3">
            Andon Management
            {events.filter(e => e.priority === 'critical' && e.status !== 'resolved').length > 0 && (
              <span className="bg-red-600 text-white text-body-sm font-bold px-2 py-0.5 rounded-full animate-pulse">
                {events.filter(e => e.priority === 'critical' && e.status !== 'resolved').length} CRITICAL OPEN
              </span>
            )}
          </h1>
          <p className="text-body text-text-secondary">Live Event Logging and Resolution Dashboard</p>
        </div>
        <Button variant="primary" iconLeft={<Plus size={16}/>} onClick={() => setShowRaise(true)}>Log Manual Event</Button>
      </div>

      {/* Raise Modal */}
      {showRaise && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRaise(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-heading-md mb-4">Raise Andon Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-medium mb-1">Event Title</label>
                <Input value={raiseForm.title} onChange={e => setRaiseForm(f => ({...f, title: e.target.value}))} placeholder="Brief description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-medium mb-1">Type</label>
                  <Select value={raiseForm.type} onChange={e => setRaiseForm(f => ({...f, type: e.target.value}))}
                    options={Object.entries(TYPE_CONFIG).map(([v, c]) => ({label: c.label, value: v}))} />
                </div>
                <div>
                  <label className="block text-body-sm font-medium mb-1">Priority</label>
                  <Select value={raiseForm.priority} onChange={e => setRaiseForm(f => ({...f, priority: e.target.value}))}
                    options={['critical','high','medium','low'].map(v => ({label: v.charAt(0).toUpperCase()+v.slice(1), value: v}))} />
                </div>
              </div>
              <div>
                <label className="block text-body-sm font-medium mb-1">Description</label>
                <Textarea value={raiseForm.description} onChange={e => setRaiseForm(f => ({...f, description: e.target.value}))} rows={3} placeholder="Additional details..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowRaise(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => raise.mutate()} disabled={!raiseForm.title || raise.isPending}>
                {raise.isPending ? 'Raising...' : 'Raise Andon'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
        {/* LEFT: Event List */}
        <Card className="col-span-1 flex flex-col p-0">
          <div className="p-4 border-b border-border-dark space-y-3">
            <Input placeholder="Search event ID or title..." iconLeft={<Search size={16}/>} value={search} onChange={e => setSearch(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => setTab('open')} className={`px-4 py-1.5 rounded-full text-[13px] leading-[20px] font-medium transition-colors ${tab === 'open' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface text-text-secondary hover:bg-primary'}`}>
                Open ({data?.total ?? 0})
              </button>
              <button onClick={() => setTab('resolved')} className={`px-4 py-1.5 rounded-full text-[13px] leading-[20px] font-medium transition-colors ${tab === 'resolved' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface text-text-secondary hover:bg-primary'}`}>
                Resolved
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border-dark">
            {events.length === 0 && <p className="p-8 text-center text-text-muted text-body-sm">No events found.</p>}
            {events.map(event => {
              const cfg = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.fault
              const Icon = cfg.icon
              const isSelected = (selectedId ?? events[0]?.id) === event.id
              return (
                <div key={event.id} onClick={() => setSelectedId(event.id)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-surface ${isSelected ? 'bg-blue-50 border-l-4 border-l-forest-500' : ''} ${event.slaBreached ? 'border-l-4 border-l-red-600 bg-red-50/40' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${PRIORITY_COLORS[event.priority]}`}>{event.priority}</span>
                      <span className="font-mono text-body-xs text-text-muted">#{event.id}</span>
                    </div>
                    <span className="text-body-xs text-text-muted">{timeAgo(event.raisedAt)}</span>
                  </div>
                  <h4 className="font-semibold text-body mb-1">{event.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                      <Icon size={11}/>{cfg.label}
                    </span>
                    {slaLabel(event)}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* RIGHT: Detail Panel */}
        <Card className="col-span-1 flex flex-col p-0 overflow-y-auto">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-text-muted">Select an event to view details</div>
          ) : (
            <>
              <div className={`rounded-t-lg p-5 text-white ${selected.priority === 'critical' ? 'bg-red-600' : selected.priority === 'high' ? 'bg-orange-500' : 'bg-accent'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-white/20 text-label px-2 py-1 rounded uppercase">{selected.priority}</span>
                  <span className="font-mono">#{selected.id}</span>
                </div>
                <h2 className="text-heading-lg font-bold">{selected.title}</h2>
                <div className="flex items-center gap-4 text-white/80 text-body-sm mt-1">
                  <span className="flex items-center gap-1.5"><User size={14}/> {selected.raisedBy}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14}/> {timeAgo(selected.raisedAt)}</span>
                  <span className="capitalize bg-white/20 px-2 py-0.5 rounded text-xs">{selected.status}</span>
                </div>
              </div>

              <div className="p-5 flex-1">
                <div className="bg-surface rounded-lg p-4 border border-border-dark mb-5 text-body">
                  {selected.description}
                </div>

                {selected.assignedTo && (
                  <div className="mb-5">
                    <div className="text-label uppercase text-text-muted mb-2">ASSIGNED TO</div>
                    <div className="bg-surface rounded-lg p-3 flex items-center gap-3 border border-border-dark">
                      <div className="w-9 h-9 bg-forest-100 text-forest-700 rounded-full flex items-center justify-center font-bold">
                        {selected.assignedTo.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="font-medium">{selected.assignedTo}</div>
                    </div>
                  </div>
                )}

                {selected.status !== 'resolved' && (
                  <div>
                    <h3 className="text-heading-sm mb-4">Resolution Logging</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-body-sm font-medium mb-1">Root Cause</label>
                        <Select value={rootCause} onChange={e => setRootCause(e.target.value)}
                          options={[
                            {label: '-- Select root cause --', value: ''},
                            {label: 'Hardware Failure (Electrical)', value: 'hw-elec'},
                            {label: 'Hardware Failure (Mechanical)', value: 'hw-mech'},
                            {label: 'Software / Logic', value: 'sw'},
                            {label: 'Material / Part Issue', value: 'material'},
                            {label: 'Operator Error', value: 'operator'},
                            {label: 'Process Non-Conformance', value: 'process'},
                          ]} />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium mb-1">Action Taken</label>
                        <Textarea placeholder="Describe the steps taken to resolve..." rows={4} value={actionTaken} onChange={e => setActionTaken(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {selected.status === 'resolved' && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-label uppercase text-green-700 mb-1">ROOT CAUSE</div>
                      <p className="text-body">{selected.rootCause || 'Not specified'}</p>
                    </div>
                    {selected.actionTaken && (
                      <div className="bg-surface border border-border-dark rounded-lg p-4">
                        <div className="text-label uppercase text-text-muted mb-1">ACTION TAKEN</div>
                        <p className="text-body">{selected.actionTaken}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selected.status !== 'resolved' && (
                <div className="p-5 border-t border-border-dark flex justify-end gap-3 bg-surface/30">
                  {selected.status === 'open' && (
                    <Button variant="outline" onClick={() => acknowledge.mutate(selected.id)} disabled={acknowledge.isPending}>
                      {acknowledge.isPending ? 'Acknowledging...' : 'Acknowledge'}
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    iconLeft={<CheckCircle size={16}/>}
                    disabled={!rootCause || !actionTaken || resolve.isPending}
                    onClick={() => resolve.mutate({ id: selected.id, rc: rootCause, at: actionTaken })}
                  >
                    {resolve.isPending ? 'Resolving...' : 'Mark Resolved'}
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
