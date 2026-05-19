import { useState, useEffect } from 'react'
import { Activity, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { useToast } from '../components/ui/Toast'

const LINES_DATA = [
  { id: 'l1', name: 'Assembly A1', category: 'Chassis', target: 45, stations: [
    { id: 's1', name: 'STN-010', process: 'Harness Routing', takt: 42, target: 45, op: 'OP-4921', status: 'ok' },
    { id: 's2', name: 'STN-020', process: 'Engine Drop', takt: 44, target: 45, op: 'OP-8812', status: 'ok' },
    { id: 's3', name: 'STN-030', process: 'Transmission Mount', takt: 59, target: 45, op: 'OP-8820', status: 'over' },
    { id: 's4', name: 'STN-040', process: 'Drive Shaft Install', takt: 0, target: 45, op: '-', status: 'starved' },
  ]},
  { id: 'l2', name: 'Paint Line B', category: 'Body', target: 120, stations: [
    { id: 's5', name: 'STN-010', process: 'Pre-treatment', takt: 115, target: 120, op: 'OP-9201', status: 'ok' },
    { id: 's6', name: 'STN-020', process: 'Prime Coat', takt: 0, target: 120, op: '-', status: 'fault' },
    { id: 's7', name: 'STN-030', process: 'Top Coat', takt: 0, target: 120, op: '-', status: 'fault' },
  ]},
  { id: 'l3', name: 'Trim Line C', category: 'Interior', target: 45, stations: [
    { id: 's8', name: 'STN-010', process: 'Headliner Install', takt: 47, target: 45, op: 'OP-3312', status: 'over' },
    { id: 's9', name: 'STN-020', process: 'Door Trim', takt: 46, target: 45, op: 'OP-3314', status: 'over' },
    { id: 's10', name: 'STN-030', process: 'Carpet Install', takt: 44, target: 45, op: 'OP-3318', status: 'ok' },
  ]},
]

const STATUS_CONFIG = {
  ok:      { label: 'OK',      bg: 'bg-green-100 text-green-700',  bar: 'bg-green-500' },
  over:    { label: 'OVER',    bg: 'bg-red-100 text-red-700',      bar: 'bg-red-500' },
  starved: { label: 'STARVED', bg: 'bg-gray-100 text-gray-600',    bar: 'bg-gray-400' },
  fault:   { label: 'FAULT',   bg: 'bg-red-100 text-red-700',      bar: 'bg-red-500' },
}

function TaktBar({ actual, target }: { actual: number; target: number }) {
  const pct = target > 0 ? Math.min(120, (actual / target) * 100) : 0
  const color = actual === 0 ? 'bg-gray-400' : actual > target ? 'bg-red-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }}/>
        <div className="absolute top-0 h-2 border-l-2 border-dashed border-gray-500" style={{ left: '83.3%' }}/>
      </div>
      <span className={`text-xs font-bold w-8 text-right ${actual > target ? 'text-red-600' : actual === 0 ? 'text-gray-400' : 'text-green-700'}`}>
        {actual > 0 ? actual : '-'}
      </span>
    </div>
  )
}

export function TaktTimePage() {
  const toast = useToast()
  const [selectedLine, setSelectedLine] = useState('all')
  const [selectedShift, setSelectedShift] = useState('A')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['l1']))
  const [taktData, setTaktData] = useState(LINES_DATA)

  // Simulate live takt updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTaktData(prev => prev.map(line => ({
        ...line,
        stations: line.stations.map(stn => ({
          ...stn,
          takt: stn.status === 'fault' || stn.status === 'starved' ? stn.takt : Math.max(0, stn.takt + (Math.random() > 0.5 ? 1 : -1)),
        }))
      })))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleLine = (id: string) =>
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const filtered = selectedLine === 'all' ? taktData : taktData.filter(l => l.id === selectedLine)

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl flex items-center gap-3">
            Takt Time Monitor
            <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              <Activity size={12} className="animate-pulse"/> LIVE
            </span>
          </h1>
          <p className="text-body text-text-secondary">Real-time station-level takt performance</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-surface border border-border-dark rounded-lg overflow-hidden text-body-sm shadow-sm">
            {['A','B','C'].map(s => (
              <button key={s} onClick={() => { setSelectedShift(s); toast(`Switched to Shift ${s} view`, 'info') }}
                className={`px-4 py-2 font-bold transition-colors ${selectedShift === s ? 'bg-accent text-white' : 'hover:bg-primary text-text-secondary'}`}>
                Shift {s}
              </button>
            ))}
          </div>
          <Select value={selectedLine} onChange={e => setSelectedLine(e.target.value)}
            options={[{label:'All Lines', value:'all'}, ...taktData.map(l => ({label: l.name, value: l.id}))]} />
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {filtered.map(line => {
          const isOpen = expanded.has(line.id)
          const avgTakt = line.stations.filter(s => s.takt > 0).reduce((a,b) => a + b.takt, 0) / Math.max(1, line.stations.filter(s => s.takt > 0).length)
          const bottleneck = line.stations.reduce((a, b) => b.takt > a.takt ? b : a, line.stations[0])
          return (
            <Card key={line.id} className="p-0 overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors text-left"
                onClick={() => toggleLine(line.id)}>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-bold text-body">{line.name}</div>
                    <div className="text-body-sm text-text-muted">{line.category} Â· Target: {line.target}s</div>
                  </div>
                  <div className="flex gap-3 text-body-sm">
                    <div className="bg-surface px-3 py-1 rounded-lg">
                      <span className="text-text-muted">Avg:</span> <span className="font-bold">{avgTakt.toFixed(1)}s</span>
                    </div>
                    <div className="bg-surface px-3 py-1 rounded-lg">
                      <span className="text-text-muted">Bottleneck:</span> <span className="font-bold text-red-600">{bottleneck.name}</span>
                    </div>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-text-muted"/> : <ChevronDown size={18} className="text-text-muted"/>}
              </button>

              {isOpen && (
                <div className="border-t border-border">
                  <table className="w-full text-body-sm">
                    <thead className="bg-surface text-label text-text-muted uppercase">
                      <tr>
                        <th className="p-3 text-left">STATION</th>
                        <th className="p-3 text-left">PROCESS</th>
                        <th className="p-3 text-left">OPERATOR</th>
                        <th className="p-3 text-left w-48">TAKT (ACT / TGT)</th>
                        <th className="p-3 text-center">STATUS</th>
                        <th className="p-3"/>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {line.stations.map(stn => {
                        const cfg = STATUS_CONFIG[stn.status as keyof typeof STATUS_CONFIG]
                        return (
                          <tr key={stn.id} className="hover:bg-surface/50">
                            <td className="p-3 font-mono font-medium">{stn.name}</td>
                            <td className="p-3">{stn.process}</td>
                            <td className="p-3 text-text-secondary">{stn.op}</td>
                            <td className="p-3">
                              <TaktBar actual={stn.takt} target={stn.target}/>
                              <div className="text-body-xs text-text-muted mt-0.5">Target: {stn.target}s</div>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${cfg.bg}`}>{cfg.label}</span>
                            </td>
                            <td className="p-3">
                              {stn.status === 'over' && (
                                <button onClick={() => toast(`Andon raised for ${stn.name} - ${stn.process}`, 'warning')}
                                  className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors">
                                  Raise Andon
                                </button>
                              )}
                              {stn.status === 'fault' && (
                                <button onClick={() => toast(`Maintenance ticket opened for ${stn.name}`, 'warning')}
                                  className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200 transition-colors">
                                  Log Ticket
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
