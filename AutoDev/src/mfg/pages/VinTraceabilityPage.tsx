import { useState } from 'react'
import { Search, ChevronRight, Package, MapPin, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useToast } from '../components/ui/Toast'

interface TraceEvent { time: string; event: string; location: string; actor: string; status: 'ok' | 'warn' | 'error' }
interface VehicleRecord {
  vin: string
  model: string
  status: string
  plant: string
  line: string
  wo: string
  startDate: string
  eolStatus: string
  events: TraceEvent[]
}

const VEHICLES: Record<string, VehicleRecord> = {
  '1G1YD2E0XN5100': {
    vin: '1G1YD2E0XN5100', model: 'AutoMFG EV-X 2024', status: 'In Production', plant: 'Detroit-04', line: 'Assembly A1', wo: 'WO-44921-X', startDate: 'Oct 16', eolStatus: 'Pending',
    events: [
      { time: '10:02 AM', event: 'WO Released to Line', location: 'ASM-Line-4', actor: 'System', status: 'ok' },
      { time: '10:14 AM', event: 'Andon Raised - Robot Arm Jam Stn 14', location: 'STN-040', actor: 'J. Smith', status: 'warn' },
      { time: '10:56 AM', event: 'Maintenance Resolved Andon', location: 'STN-040', actor: 'Mike Kim', status: 'ok' },
      { time: '11:02 AM', event: 'Awaiting EOL Test', location: 'EOL-01', actor: 'System', status: 'ok' },
    ],
  },
  'EL-884B-00182': {
    vin: 'EL-884B-00182', model: 'AutoMFG FX-3 2024', status: 'EOL Failed', plant: 'Detroit-04', line: 'Sub-Assy-2', wo: 'WO-44923-Z', startDate: 'Oct 15', eolStatus: 'Fail',
    events: [
      { time: '08:30 AM', event: 'WO Released to Line', location: 'Sub-Assy-2', actor: 'System', status: 'ok' },
      { time: '09:10 AM', event: 'NCR Logged - Dimensional Variance', location: 'STN-020', actor: 'A. Smith', status: 'warn' },
      { time: '10:45 AM', event: 'EOL Test - FAIL: Brake Pressure', location: 'EOL-01', actor: 'Tester-02', status: 'error' },
    ],
  },
  'PT-902A-00241': {
    vin: 'PT-902A-00241', model: 'AutoMFG HX-5 2024', status: 'Completed', plant: 'Detroit-04', line: 'Paint-Line-1', wo: 'WO-44922-Y', startDate: 'Oct 17', eolStatus: 'Pass',
    events: [
      { time: '07:00 AM', event: 'WO Released', location: 'Paint-Line-1', actor: 'System', status: 'ok' },
      { time: '09:30 AM', event: 'Paint NCR Logged - Surface Scratch', location: 'Stamping Line', actor: 'M. Rossi', status: 'warn' },
      { time: '10:00 AM', event: 'NCR Disposed - Scrap', location: 'QC Lab', actor: 'M. Rossi', status: 'ok' },
      { time: '10:55 AM', event: 'EOL Test - PASS', location: 'EOL-02', actor: 'Tester-01', status: 'ok' },
      { time: '11:10 AM', event: 'Vehicle Released to Shipping', location: 'Dispatch Bay', actor: 'System', status: 'ok' },
    ],
  },
}

const STATUS_ICON = { ok: CheckCircle, warn: AlertTriangle, error: AlertTriangle }
const STATUS_COLOR = { ok: 'text-green-600', warn: 'text-amber-500', error: 'text-red-600' }
const LINE_COLOR = { ok: 'bg-green-500', warn: 'bg-amber-400', error: 'bg-red-500' }

export function VinTraceabilityPage() {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<VehicleRecord | null>(null)
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<VehicleRecord[]>([])

  const doSearch = () => {
    if (!query.trim()) { toast('Enter a VIN or WO number to search', 'error'); return }
    const q = query.toUpperCase().trim()
    const found = Object.values(VEHICLES).filter(v =>
      v.vin.toUpperCase().includes(q) || v.wo.toUpperCase().includes(q) || v.model.toUpperCase().includes(q)
    )
    setResults(found)
    setSearched(true)
    if (found.length === 0) toast(`No records found for "${query}"`, 'warning')
    else { setSelected(found[0]); toast(`Found ${found.length} record(s)`, 'success') }
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="mb-1">
        <h1 className="text-heading-xl">VIN Traceability</h1>
        <p className="text-body text-text-secondary">End-to-end vehicle history search</p>
      </div>

      <Card className="p-4">
        <div className="flex gap-3">
          <Input
            className="flex-1"
            placeholder="Search by VIN, Work Order number, or model..."
            iconLeft={<Search size={16}/>}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
          />
          <Button variant="primary" onClick={doSearch}>Search</Button>
        </div>
        <div className="flex gap-2 mt-3">
          {['1G1YD2E0XN5100', 'EL-884B-00182', 'PT-902A-00241'].map(vin => (
            <button key={vin} onClick={() => { setQuery(vin); const r = Object.values(VEHICLES).filter(v => v.vin === vin); setResults(r); setSearched(true); setSelected(r[0] ?? null) }}
              className="text-body-xs font-mono bg-surface border border-border px-2 py-1 rounded hover:bg-gray-100 transition-colors text-forest-600">
              {vin}
            </button>
          ))}
          <span className="text-body-xs text-text-muted self-center ml-1">{"<-"} example VINs</span>
        </div>
      </Card>

      {!searched && (
        <div className="flex-1 flex items-center justify-center flex-col gap-3 text-text-muted">
          <Search size={48} className="opacity-20"/>
          <p className="text-body">Enter a VIN or Work Order number to trace a vehicle</p>
        </div>
      )}

      {searched && results.length > 0 && (
        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
          {/* Results list */}
          {results.length > 1 && (
            <Card className="p-0 flex flex-col">
              <div className="p-3 border-b border-border text-body-sm font-medium">{results.length} results</div>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {results.map(v => (
                  <button key={v.vin} onClick={() => setSelected(v)}
                    className={`w-full text-left p-4 hover:bg-surface transition-colors ${selected?.vin === v.vin ? 'bg-blue-50' : ''}`}>
                    <div className="font-mono font-medium text-body">{v.vin}</div>
                    <div className="text-body-sm text-text-muted">{v.model}</div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Detail */}
          {selected && (
            <div className={`${results.length > 1 ? 'col-span-2' : 'col-span-3'} flex flex-col gap-4`}>
              <Card className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-heading-lg font-mono">{selected.vin}</h2>
                    <p className="text-body text-text-secondary">{selected.model}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-sm font-bold ${selected.eolStatus === 'Pass' ? 'bg-green-100 text-green-700' : selected.eolStatus === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {selected.eolStatus === 'Pass' && <CheckCircle size={14}/>}
                      {selected.eolStatus === 'Fail' && <AlertTriangle size={14}/>}
                      EOL: {selected.eolStatus}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-body-sm">
                  {[['Status', selected.status], ['Plant', selected.plant], ['Line', selected.line], ['Work Order', selected.wo]].map(([l, v]) => (
                    <div key={l}>
                      <div className="text-label uppercase text-text-muted mb-0.5">{l}</div>
                      <div className="font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 flex-1">
                <h3 className="text-heading-sm mb-4">Production Timeline</h3>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"/>
                  <div className="space-y-4">
                    {selected.events.map((evt, i) => {
                      const Icon = STATUS_ICON[evt.status]
                      return (
                        <div key={i} className="flex gap-4 relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 bg-white border-2 ${evt.status === 'ok' ? 'border-green-400' : evt.status === 'warn' ? 'border-amber-400' : 'border-red-400'}`}>
                            <Icon size={18} className={STATUS_COLOR[evt.status]}/>
                          </div>
                          <div className="bg-surface rounded-xl p-3 flex-1 border border-border">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-body">{evt.event}</span>
                              <span className="text-body-xs text-text-muted">{evt.time}</span>
                            </div>
                            <div className="flex gap-3 text-body-xs text-text-muted mt-1">
                              <span className="flex items-center gap-1"><MapPin size={10}/>{evt.location}</span>
                              <span className="flex items-center gap-1"><Zap size={10}/>{evt.actor}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
