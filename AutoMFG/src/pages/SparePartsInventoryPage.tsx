import { useState } from 'react'
import { Search, Plus, AlertTriangle, Minus, Package, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/api'
import { useToast } from '@/components/ui/Toast'
import type { SparePart } from '@/types'

const STATUS_CONFIG = {
  ok:       { label: 'OK',       bg: 'bg-green-100',  text: 'text-green-700' },
  reorder:  { label: 'REORDER',  bg: 'bg-orange-100', text: 'text-orange-700' },
  stockout: { label: 'STOCKOUT', bg: 'bg-red-100',    text: 'text-red-700' },
}

const BLANK_PART = { partNumber: '', description: '', category: 'Mechanical', location: '', onHand: '0', minLevel: '5', maxLevel: '20', unitCost: '0' }

export function SparePartsInventoryPage() {
  const qc = useQueryClient()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [adjusting, setAdjusting] = useState<{ id: string; delta: number } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(BLANK_PART)

  const { data, isLoading } = useQuery({
    queryKey: ['spare-parts', statusFilter, search],
    queryFn: () => inventoryApi.getParts({
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(search && { search }),
      limit: '100',
    }),
  })

  const { data: alerts = [] } = useQuery({
    queryKey: ['parts-alerts'],
    queryFn: inventoryApi.getAlerts,
    refetchInterval: 60000,
  })

  const adjust = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) => inventoryApi.adjustStock(id, qty),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['spare-parts'] })
      qc.invalidateQueries({ queryKey: ['parts-alerts'] })
      setAdjusting(null)
      toast('Stock adjusted successfully', 'success')
    },
  })

  const addPart = useMutation({
    mutationFn: (payload: any) => inventoryApi.addPart(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['spare-parts'] })
      qc.invalidateQueries({ queryKey: ['parts-alerts'] })
      toast(`Part ${form.partNumber} added to inventory`, 'success')
      setShowAdd(false)
      setForm(BLANK_PART)
    },
    onError: () => toast('Failed to add part', 'error'),
  })

  const handleAddPart = () => {
    if (!form.partNumber || !form.description) { toast('Part number and description are required', 'error'); return }
    addPart.mutate({
      partNumber: form.partNumber,
      description: form.description,
      category: form.category,
      location: form.location,
      onHand: parseInt(form.onHand) || 0,
      minLevel: parseInt(form.minLevel) || 5,
      maxLevel: parseInt(form.maxLevel) || 20,
      unitCost: parseFloat(form.unitCost) || 0,
    })
  }

  const parts: SparePart[] = data?.data ?? []
  const alertParts = alerts as SparePart[]

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl flex items-center gap-3">
            Spare Parts Inventory
            {alertParts.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {alertParts.length} ALERTS
              </span>
            )}
          </h1>
          <p className="text-body text-text-secondary">{data?.total ?? 0} parts in inventory</p>
        </div>
        <Button variant="primary" iconLeft={<Package size={16}/>} onClick={() => setShowAdd(true)}>Add Part</Button>
      </div>

      {/* Alert Strip */}
      {alertParts.filter(p => p.status === 'stockout').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3 text-red-700 text-body-sm">
          <AlertTriangle size={16}/>
          <strong>{alertParts.filter(p => p.status === 'stockout').length} STOCKOUT{alertParts.filter(p => p.status === 'stockout').length > 1 ? 'S' : ''}:</strong>
          {alertParts.filter(p => p.status === 'stockout').slice(0, 4).map(p => (
            <span key={p.id} className="font-mono bg-red-100 px-2 py-0.5 rounded">{p.partNumber}</span>
          ))}
          {alertParts.filter(p => p.status === 'reorder').length > 0 && (
            <span className="ml-2 text-orange-600 font-medium">{alertParts.filter(p => p.status === 'reorder').length} at reorder level</span>
          )}
        </div>
      )}

      {/* Add Part Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-md">Add New Part</h2>
              <button onClick={() => setShowAdd(false)} className="text-text-muted hover:text-text-primary"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-body-sm font-medium mb-1">Part Number *</label><Input value={form.partNumber} onChange={e => setForm(f => ({...f, partNumber: e.target.value}))} placeholder="e.g. PUMP-V2-ASSY"/></div>
              <div className="col-span-2"><label className="block text-body-sm font-medium mb-1">Description *</label><Input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Full description"/></div>
              <div><label className="block text-body-sm font-medium mb-1">Category</label>
                <Select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  options={['Mechanical','Electrical','Hydraulic','Consumables','Electronics','Hardware'].map(v => ({label:v,value:v}))}/>
              </div>
              <div><label className="block text-body-sm font-medium mb-1">Location</label><Input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="Whse A - Bin 42"/></div>
              <div><label className="block text-body-sm font-medium mb-1">On Hand</label><Input type="number" value={form.onHand} onChange={e => setForm(f => ({...f, onHand: e.target.value}))}/></div>
              <div><label className="block text-body-sm font-medium mb-1">Unit Cost ($)</label><Input type="number" step="0.01" value={form.unitCost} onChange={e => setForm(f => ({...f, unitCost: e.target.value}))}/></div>
              <div><label className="block text-body-sm font-medium mb-1">Min Level</label><Input type="number" value={form.minLevel} onChange={e => setForm(f => ({...f, minLevel: e.target.value}))}/></div>
              <div><label className="block text-body-sm font-medium mb-1">Max Level</label><Input type="number" value={form.maxLevel} onChange={e => setForm(f => ({...f, maxLevel: e.target.value}))}/></div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={handleAddPart}>Add to Inventory</Button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjusting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setAdjusting(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-heading-md mb-2">Adjust Stock</h2>
            {(() => {
              const part = parts.find(p => p.id === adjusting.id)
              return (
                <>
                  <p className="text-body-sm text-text-secondary mb-1">{part?.description}</p>
                  <p className="text-body-sm text-text-secondary mb-5">Current qty: <strong>{part?.onHand ?? 0}</strong></p>
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setAdjusting(a => a && { ...a, delta: a.delta - 1 })}
                      className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xl font-bold hover:bg-red-200">
                      <Minus size={20}/>
                    </button>
                    <div className="flex-1 text-center">
                      <span className={`text-4xl font-bold ${adjusting.delta > 0 ? 'text-green-600' : adjusting.delta < 0 ? 'text-red-600' : 'text-text-primary'}`}>
                        {adjusting.delta > 0 ? '+' : ''}{adjusting.delta}
                      </span>
                      <p className="text-body-xs text-text-muted mt-1">
                        New total: {Math.max(0, (part?.onHand ?? 0) + adjusting.delta)}
                      </p>
                    </div>
                    <button onClick={() => setAdjusting(a => a && { ...a, delta: a.delta + 1 })}
                      className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold hover:bg-green-200">
                      <Plus size={20}/>
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setAdjusting(null)}>Cancel</Button>
                    <Button variant="primary" className="flex-1" disabled={adjusting.delta === 0 || adjust.isPending}
                      onClick={() => adjust.mutate({ id: adjusting.id, qty: adjusting.delta })}>
                      {adjust.isPending ? 'Saving…' : 'Confirm'}
                    </Button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 flex gap-3 items-end">
        <div className="flex-[2]">
          <label className="block text-label uppercase text-text-muted mb-1">SEARCH</label>
          <Input placeholder="Part number or description…" iconLeft={<Search size={16}/>}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex-1">
          <label className="block text-label uppercase text-text-muted mb-1">STATUS</label>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            options={[{label:'All Parts',value:'all'},{label:'OK',value:'ok'},{label:'Reorder',value:'reorder'},{label:'Stockout',value:'stockout'}]} />
        </div>
      </Card>

      <Card className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface sticky top-0 border-b border-border z-10 text-label text-text-muted uppercase">
              <tr>
                <th className="p-3">PART NUMBER</th>
                <th className="p-3">DESCRIPTION</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3 text-right">ON HAND</th>
                <th className="p-3">MIN / MAX</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">LOCATION</th>
                <th className="p-3 text-right">UNIT COST</th>
                <th className="p-3">ADJUST</th>
              </tr>
            </thead>
            <tbody className="text-body-sm divide-y divide-border">
              {isLoading && <tr><td colSpan={9} className="p-8 text-center text-text-muted">Loading…</td></tr>}
              {!isLoading && parts.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-text-muted">No parts found.</td></tr>}
              {parts.map((part: SparePart) => {
                const cfg = STATUS_CONFIG[part.status]
                return (
                  <tr key={part.id} className={`hover:bg-surface ${part.status === 'stockout' ? 'bg-red-50/30' : ''}`}>
                    <td className="p-3 font-mono font-medium">{part.partNumber}</td>
                    <td className="p-3">{part.description}</td>
                    <td className="p-3 text-text-secondary">{part.category}</td>
                    <td className={`p-3 text-right font-bold ${part.status === 'stockout' ? 'text-red-600' : part.status === 'reorder' ? 'text-orange-600' : 'text-green-700'}`}>
                      {part.onHand}
                    </td>
                    <td className="p-3 text-text-secondary">{part.minLevel} / {part.maxLevel}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </td>
                    <td className="p-3 text-text-secondary font-mono text-xs">{part.location ?? '—'}</td>
                    <td className="p-3 text-right text-text-secondary">${part.unitCost.toLocaleString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setAdjusting({ id: part.id, delta: 0 })}
                        className="px-3 py-1 bg-forest-100 text-forest-700 rounded text-xs font-medium hover:bg-forest-200 transition-colors"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border bg-surface/50 flex items-center justify-between text-body-sm text-text-muted">
          <span>{parts.length} parts shown</span>
          <div className="flex gap-4">
            <span>Stockout: <strong className="text-red-600">{alertParts.filter(p => p.status === 'stockout').length}</strong></span>
            <span>Reorder: <strong className="text-orange-600">{alertParts.filter(p => p.status === 'reorder').length}</strong></span>
          </div>
        </div>
      </Card>
    </div>
  )
}
