import { useState } from 'react'
import { Search, Plus, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { useToast } from '../components/ui/Toast'

interface Vehicle { id: string; vin: string; model: string; status: 'Pass' | 'Fail' | 'Pending' | 'Retest'; line: string; time: string; defect?: string }

const INITIAL: Vehicle[] = [
  { id: 'v1', vin: '1G1YD2E0XN5100', model: 'Model EV-X', status: 'Pending', line: 'EOL-01', time: '11:02 AM', defect: undefined },
  { id: 'v2', vin: 'PT-902A-00241',  model: 'Model HX-5', status: 'Pass',    line: 'EOL-02', time: '10:55 AM', defect: undefined },
  { id: 'v3', vin: 'EL-884B-00182',  model: 'Model FX-3', status: 'Fail',    line: 'EOL-01', time: '10:48 AM', defect: 'Brake pressure below spec (12.4 bar / min 14 bar)' },
  { id: 'v4', vin: 'CHG-112-EV-088', model: 'Model EV-X', status: 'Retest',  line: 'EOL-03', time: '10:33 AM', defect: 'Headlamp alignment - repaired' },
  { id: 'v5', vin: '1G1YD2E0XN5088', model: 'Model EV-X', status: 'Pass',    line: 'EOL-02', time: '10:18 AM', defect: undefined },
]

const STATUS_CFG = {
  Pass:    { bg: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  Fail:    { bg: 'bg-red-100 text-red-700',     dot: 'bg-red-500' },
  Pending: { bg: 'bg-gray-100 text-gray-600',   dot: 'bg-gray-400' },
  Retest:  { bg: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
}

export function EolTestingPage() {
  const toast = useToast()
  const [vehicles, setVehicles] = useState(INITIAL)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [defectNote, setDefectNote] = useState('')
  const [failCategory, setFailCategory] = useState('Brakes')

  const recordResult = (id: string, result: 'Pass' | 'Fail' | 'Retest') => {
    setVehicles(prev => prev.map(v => v.id === id ? {
      ...v,
      status: result,
      defect: result === 'Fail' ? `${failCategory}: ${defectNote || 'See inspection notes'}` : v.defect,
    } : v))
    const v = vehicles.find(x => x.id === id)
    toast(`${v?.vin} recorded as ${result}`, result === 'Pass' ? 'success' : 'error')
    setDefectNote('')
  }

  const filtered = vehicles.filter(v => !search || v.vin.toLowerCase().includes(search.toLowerCase()) || v.model.toLowerCase().includes(search.toLowerCase()))
  const selected = filtered.find(v => v.id === selectedId) ?? filtered.find(v => v.status === 'Pending') ?? filtered[0]

  const stats = {
    total: vehicles.length,
    pass: vehicles.filter(v => v.status === 'Pass').length,
    fail: vehicles.filter(v => v.status === 'Fail').length,
    pending: vehicles.filter(v => v.status === 'Pending').length,
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">End-of-Line Testing</h1>
          <p className="text-body text-text-secondary">Final vehicle inspection & pass/fail recording</p>
        </div>
        <div className="flex gap-4 text-body-sm">
          {[['Pass', stats.pass, 'text-green-700 bg-green-100'], ['Fail', stats.fail, 'text-red-700 bg-red-100'], ['Pending', stats.pending, 'text-gray-700 bg-gray-100']].map(([label, count, cls]) => (
            <div key={label as string} className={`px-3 py-2 rounded-lg font-medium ${cls}`}>{label}: <strong>{count}</strong></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
        {/* Vehicle Queue */}
        <Card className="flex flex-col p-0">
          <div className="p-3 border-b border-border">
            <Input placeholder="Search VIN or model..." iconLeft={<Search size={16}/>} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filtered.map(v => {
              const cfg = STATUS_CFG[v.status]
              const isSelected = (selectedId ?? filtered.find(x => x.status === 'Pending')?.id ?? filtered[0]?.id) === v.id
              return (
                <div key={v.id} onClick={() => setSelectedId(v.id)}
                  className={`p-4 cursor-pointer hover:bg-surface transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-l-forest-500' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono font-medium text-body">{v.vin}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${cfg.bg}`}>{v.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-body-sm text-text-secondary">
                    <span>{v.model}</span><span>·</span><span>{v.line}</span><span>·</span><span>{v.time}</span>
                  </div>
                  {v.defect && <p className="text-body-xs text-red-600 mt-1">{v.defect}</p>}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Test Panel */}
        <Card className="flex flex-col p-0 overflow-y-auto">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-text-muted">Select a vehicle to record test result</div>
          ) : (
            <>
              <div className={`p-5 rounded-t-lg text-white ${selected.status === 'Fail' ? 'bg-red-600' : selected.status === 'Pass' ? 'bg-green-600' : 'bg-forest-700'}`}>
                <div className="text-sm opacity-80 mb-1">{selected.line} · {selected.time}</div>
                <h2 className="text-heading-lg font-bold">{selected.vin}</h2>
                <p className="text-white/80">{selected.model}</p>
                <div className="mt-2 inline-block bg-white/20 px-2 py-0.5 rounded text-sm font-medium">{selected.status}</div>
              </div>

              <div className="p-5 flex-1">
                {selected.defect && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-label uppercase text-red-700 mb-1">DEFECT NOTED</div>
                    <p className="text-body-sm text-red-800">{selected.defect}</p>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-heading-sm mb-3">Test Result</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button onClick={() => recordResult(selected.id, 'Pass')}
                      className="py-3 rounded-xl border-2 border-green-300 bg-green-50 text-green-700 font-bold text-body flex flex-col items-center gap-1 hover:bg-green-100 transition-colors">
                      <CheckCircle size={24}/> PASS
                    </button>
                    <button onClick={() => recordResult(selected.id, 'Fail')}
                      className="py-3 rounded-xl border-2 border-red-300 bg-red-50 text-red-700 font-bold text-body flex flex-col items-center gap-1 hover:bg-red-100 transition-colors">
                      <XCircle size={24}/> FAIL
                    </button>
                    <button onClick={() => recordResult(selected.id, 'Retest')}
                      className="py-3 rounded-xl border-2 border-orange-300 bg-orange-50 text-orange-700 font-bold text-body flex flex-col items-center gap-1 hover:bg-orange-100 transition-colors">
                      <RefreshCw size={24}/> RETEST
                    </button>
                  </div>

                  <div>
                    <label className="block text-body-sm font-medium mb-1">Defect Category (if Fail)</label>
                    <Select value={failCategory} onChange={e => setFailCategory(e.target.value)}
                      options={['Brakes','Steering','Lighting','Emissions','Electrical','Alignment','Sealing','Other'].map(v => ({label: v, value: v}))} />
                  </div>
                  <div className="mt-3">
                    <label className="block text-body-sm font-medium mb-1">Notes</label>
                    <Textarea rows={3} value={defectNote} onChange={e => setDefectNote(e.target.value)} placeholder="Describe the defect or inspection notes..." />
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
