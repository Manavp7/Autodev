import { useState } from 'react'
import { Search, Plus, ShieldCheck, AlertOctagon } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { qualityApi } from '../api'
import type { Defect, DispositionType } from '../types'
import api from '../../api/client'
import { useEventBus } from '../../stores/eventBus'

const DISP_OPTIONS: { label: string; value: DispositionType; color: string }[] = [
  { label: 'Scrap', value: 'scrap', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { label: 'Rework', value: 'rework', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { label: 'UAI', value: 'uai', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
]

interface ControlPlanItem {
  characteristic: string
  spec: string
  method: string
  sampleSize: number
  frequency: string
}
interface ControlPlan {
  partNumber: string
  items: ControlPlanItem[]
}

export function ProductionQualityGatePage() {
  const qc = useQueryClient()
  const emit = useEventBus((s) => s.emit)
  const [search, setSearch] = useState('')
  const [dispFilter, setDispFilter] = useState('all')
  const [controlPlanPart, setControlPlanPart] = useState('8042-PW-01')

  // Handoff #7: Quality gate inspection plan <- PPAP (AutoDev)
  const { data: controlPlan } = useQuery<ControlPlan>({
    queryKey: ['ppap-control-plan', controlPlanPart],
    queryFn: async () => {
      const res = await api.get(`/ppap/${encodeURIComponent(controlPlanPart)}/control-plan`)
      return res.data as ControlPlan
    },
    enabled: !!controlPlanPart,
  })

  const handleHoldDefect = (defectId: string, woId: string) => {
    // Handoff: quality.hold cross-broadcast
    emit({ type: 'quality.hold', woId, defectId })
  }

  const { data, isLoading } = useQuery({
    queryKey: ['defects', dispFilter, search],
    queryFn: () => qualityApi.getDefects({
      ...(dispFilter !== 'all' && { disposition: dispFilter }),
      ...(search && { search }),
    }),
    refetchInterval: 30000,
  })

  const { data: stats } = useQuery({
    queryKey: ['quality-stats'],
    queryFn: qualityApi.getStats,
    refetchInterval: 30000,
  })

  const setDisposition = useMutation({
    mutationFn: ({ id, disposition }: { id: string; disposition: DispositionType }) =>
      qualityApi.setDisposition(id, disposition),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['defects'] }),
  })

  const defects: Defect[] = data?.data ?? []

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">Production Quality Gate</h1>
          <p className="text-body text-text-secondary">Non-Conformance Tracking & Disposition</p>
        </div>
        <Button variant="primary" iconLeft={<Plus size={16}/>}>Log NCR</Button>
      </div>

      {/* Control Plan from PPAP (cross-module handoff #7) */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-forest-600"/>
            <h3 className="text-heading-sm">Control Plan (sourced from PPAP)</h3>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              value={controlPlanPart}
              onChange={(e) => setControlPlanPart(e.target.value)}
              placeholder="Part number"
              className="w-44"
            />
            <span className="text-body-xs text-text-muted">via /ppap/:partNumber/control-plan</span>
          </div>
        </div>
        {controlPlan && (
          <table className="w-full text-body-sm">
            <thead className="text-label text-text-muted uppercase border-b border-border">
              <tr>
                <th className="p-2 text-left">Characteristic</th>
                <th className="p-2 text-left">Spec</th>
                <th className="p-2 text-left">Method</th>
                <th className="p-2 text-right">Sample</th>
                <th className="p-2 text-left">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {controlPlan.items.map((it, i) => (
                <tr key={i} className="hover:bg-surface">
                  <td className="p-2 font-medium">{it.characteristic}</td>
                  <td className="p-2 font-mono text-xs">{it.spec}</td>
                  <td className="p-2">{it.method}</td>
                  <td className="p-2 text-right">{it.sampleSize}</td>
                  <td className="p-2">{it.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total NCRs', value: stats.totalDefects, color: 'text-text-primary' },
            { label: 'Scrap Today', value: stats.scrapCount, color: 'text-red-600' },
            { label: 'Rework Today', value: stats.reworkCount, color: 'text-blue-600' },
            { label: 'Scrap Cost', value: `$${stats.scrapCost?.toLocaleString()}`, color: 'text-red-600' },
          ].map(s => (
            <Card key={s.label} className="p-4">
              <div className="text-label uppercase text-text-muted mb-1">{s.label}</div>
              <div className={`text-kpi font-bold leading-none ${s.color}`}>{s.value}</div>
            </Card>
          ))}
        </div>
      )}

      <Card className="flex-1 flex flex-col p-0 min-h-0">
        <div className="p-4 border-b border-border flex gap-3 items-center bg-white">
          <div className="flex-1">
            <Input placeholder="Search part number, station..." iconLeft={<Search size={16}/>}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select
            value={dispFilter}
            onChange={e => setDispFilter(e.target.value)}
            options={[
              { label: 'All Dispositions', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Scrap', value: 'scrap' },
              { label: 'Rework', value: 'rework' },
              { label: 'UAI', value: 'uai' },
            ]}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface sticky top-0 border-b border-border z-10 text-label text-text-muted uppercase">
              <tr>
                <th className="p-3">NCR ID</th>
                <th className="p-3">PART NUMBER</th>
                <th className="p-3">STATION</th>
                <th className="p-3">DEFECT TYPE</th>
                <th className="p-3">QTY</th>
                <th className="p-3">LOGGED BY</th>
                <th className="p-3">COST</th>
                <th className="p-3">DISPOSITION</th>
              </tr>
            </thead>
            <tbody className="text-body-sm divide-y divide-border">
              {isLoading && <tr><td colSpan={8} className="p-8 text-center text-text-muted">Loading...</td></tr>}
              {!isLoading && defects.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-text-muted">No defects found.</td></tr>}
              {defects.map((defect: Defect) => (
                <tr key={defect.id} className="hover:bg-surface">
                  <td className="p-3 font-mono text-forest-600">{defect.id}</td>
                  <td className="p-3 font-mono">{defect.partNumber}</td>
                  <td className="p-3">{defect.stationId}</td>
                  <td className="p-3">{defect.defectType}</td>
                  <td className="p-3 font-bold">{defect.qty}</td>
                  <td className="p-3 text-text-secondary">{defect.loggedBy}</td>
                  <td className="p-3 font-medium">{defect.cost ? `$${defect.cost.toLocaleString()}` : '-'}</td>
                  <td className="p-3">
                    {defect.disposition !== 'pending' ? (
                      <Badge disposition={defect.disposition as any}>{defect.disposition.toUpperCase()}</Badge>
                    ) : (
                      <div className="flex gap-1">
                        {DISP_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setDisposition.mutate({ id: defect.id, disposition: opt.value })}
                            disabled={setDisposition.isPending}
                            className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${opt.color}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                        <button
                          onClick={() => handleHoldDefect(defect.id, (defect as any).workOrderId ?? 'WO-UNKNOWN')}
                          className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center gap-1"
                          title="Place WO on quality hold"
                        >
                          <AlertOctagon size={12}/> Hold
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
