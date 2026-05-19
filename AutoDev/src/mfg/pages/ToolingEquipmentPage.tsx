import { useState } from 'react'
import { Plus, Search, Wrench, AlertTriangle, CheckCircle, Download } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { useToast } from '../components/ui/Toast'

const INITIAL_TOOLS = [
  { id: 'T-4091A', type: 'Torque Wrench', location: 'Stn 14', nextCalib: 'Today',   cycleLife: 9800, maxCycle: 10000, status: 'Active',  alert: true  },
  { id: 'T-4092B', type: 'Rivet Gun',     location: 'Stn 15', nextCalib: '2 Days',  cycleLife: 4250, maxCycle: 5000,  status: 'Active',  alert: true  },
  { id: 'M-9022X', type: 'Micrometer',    location: 'QC Lab',  nextCalib: 'Nov 15',  cycleLife: 300,  maxCycle: 1000,  status: 'Maint',   alert: false },
  { id: 'T-8831C', type: 'Impact Driver', location: 'Stn 12', nextCalib: 'Dec 01',  cycleLife: 1200, maxCycle: 8000,  status: 'Active',  alert: false },
  { id: 'T-5502Z', type: 'Calibration Jig','location': 'QC Lab','nextCalib': 'Nov 20', cycleLife: 50, maxCycle: 200,   status: 'Active',  alert: false },
]

export function ToolingEquipmentPage() {
  const toast = useToast()
  const [tools, setTools] = useState(INITIAL_TOOLS)
  const [search, setSearch] = useState('')
  const [showRequest, setShowRequest] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [reqForm, setReqForm] = useState({ toolId: '', reason: 'Max Cycle Limit Reached', priority: 'High', notes: '' })
  const [regForm, setRegForm] = useState({ id: '', type: '', location: '', nextCalib: '', maxCycle: '' })
  const [priority, setPriority] = useState<'High' | 'Normal'>('High')

  const alertCount = tools.filter(t => t.alert).length
  const filtered = tools.filter(t =>
    !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase())
  )

  const submitRequest = () => {
    if (!reqForm.toolId) { toast('Enter a Tool ID', 'error'); return }
    toast(`Replacement request submitted for ${reqForm.toolId} - Priority: ${priority}`, 'success')
    setShowRequest(false)
    setReqForm({ toolId: '', reason: 'Max Cycle Limit Reached', priority: 'High', notes: '' })
  }

  const registerTool = () => {
    if (!regForm.id || !regForm.type) { toast('Tool ID and Type are required', 'error'); return }
    setTools(prev => [...prev, {
      id: regForm.id, type: regForm.type, location: regForm.location,
      nextCalib: regForm.nextCalib || 'TBD', cycleLife: 0, maxCycle: parseInt(regForm.maxCycle) || 10000,
      status: 'Active', alert: false,
    }])
    toast(`Tool ${regForm.id} registered successfully`, 'success')
    setShowRegister(false)
    setRegForm({ id: '', type: '', location: '', nextCalib: '', maxCycle: '' })
  }

  const scheduleCalib = (id: string) => {
    setTools(prev => prev.map(t => t.id === id ? {...t, alert: false, nextCalib: '+30 Days'} : t))
    toast(`Calibration scheduled for ${id}`, 'success')
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">Tooling & Equipment</h1>
          <p className="text-body text-text-secondary">Manage and track precision tools</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" iconLeft={<Download size={16}/>} onClick={() => toast('Tool register exported', 'success')}>Export Reg</Button>
          <Button variant="primary" iconLeft={<Plus size={16}/>} onClick={() => setShowRegister(true)}>Register Tool</Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-700">
            <AlertTriangle size={18}/>
            <div>
              <span className="font-semibold">Calibration Action Required</span>
              <p className="text-body-sm">{alertCount} critical tools are within 48 hours of calibration expiry or have exceeded cycle life.</p>
            </div>
          </div>
          <button onClick={() => toast(`Reviewing ${alertCount} calibration alerts...`, 'info')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-body-sm font-medium hover:bg-red-700 transition-colors">
            Review Alerts ({alertCount})
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
        {/* Tool List */}
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex gap-3">
            <Input className="flex-1" placeholder="Search by Tool ID or type..." iconLeft={<Search size={16}/>}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Card className="flex-1 p-0 overflow-hidden flex flex-col">
            <div className="p-3 bg-surface border-b border-border text-body-sm font-medium flex items-center justify-between">
              <span>Active Tools Inventory</span>
              <span className="text-text-muted">{tools.length} Total</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface sticky top-0 border-b border-border text-label text-text-muted uppercase">
                  <tr>
                    <th className="p-3 text-left">TOOL ID</th>
                    <th className="p-3 text-left">TYPE</th>
                    <th className="p-3 text-left">LOCATION</th>
                    <th className="p-3 text-left">NEXT CALIB.</th>
                    <th className="p-3 text-left">LIFE CYCLE</th>
                    <th className="p-3 text-center">STATUS</th>
                    <th className="p-3"/>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(tool => {
                    const lifePct = Math.round((tool.cycleLife / tool.maxCycle) * 100)
                    const barColor = lifePct > 90 ? 'bg-red-500' : lifePct > 70 ? 'bg-orange-400' : 'bg-green-500'
                    return (
                      <tr key={tool.id} className={`hover:bg-surface ${tool.alert ? 'bg-amber-50/50' : ''}`}>
                        <td className="p-3 font-mono font-medium">{tool.id} {tool.alert && <AlertTriangle size={12} className="inline text-amber-500 ml-1"/>}</td>
                        <td className="p-3">{tool.type}</td>
                        <td className="p-3 text-text-secondary">{tool.location}</td>
                        <td className={`p-3 font-medium ${tool.alert ? 'text-red-600' : ''}`}>{tool.nextCalib}</td>
                        <td className="p-3 w-36">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${lifePct}%` }}/>
                          </div>
                          <span className="text-body-xs text-text-muted">{tool.cycleLife.toLocaleString()} / {tool.maxCycle.toLocaleString()}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${tool.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {tool.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {tool.alert && (
                            <button onClick={() => scheduleCalib(tool.id)}
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                              Schedule Calib
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <h3 className="text-heading-sm mb-4 flex items-center gap-2"><Wrench size={16}/> Replacement Request</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-body-sm font-medium mb-1">Tool ID (Current)</label>
                <Input value={reqForm.toolId} onChange={e => setReqForm(f => ({...f, toolId: e.target.value}))} placeholder="e.g. T-4091A" />
              </div>
              <div>
                <label className="block text-body-sm font-medium mb-1">Reason for Request</label>
                <Select value={reqForm.reason} onChange={e => setReqForm(f => ({...f, reason: e.target.value}))}
                  options={['Max Cycle Limit Reached','Calibration Expired','Physical Damage','Performance Degradation','Lost/Stolen'].map(v => ({label: v, value: v}))} />
              </div>
              <div>
                <label className="block text-body-sm font-medium mb-1">Priority</label>
                <div className="flex gap-2">
                  {(['High','Normal'] as const).map(p => (
                    <button key={p} onClick={() => setPriority(p)}
                      className={`flex-1 py-2 rounded-lg border text-[13px] leading-[20px] font-medium transition-colors ${priority === p ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'border-border-dark text-text-secondary hover:bg-primary'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="primary" className="w-full" onClick={submitRequest}>Submit Request</Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-heading-sm mb-3">Upload Certificate</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-surface transition-colors"
              onClick={() => toast('Certificate upload dialog opened', 'info')}>
              <p className="text-body-sm text-text-muted">Click to upload calibration certificate</p>
              <p className="text-body-xs text-text-muted mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Register Tool Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRegister(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-heading-md mb-4">Register New Tool</h2>
            <div className="space-y-3">
              <div><label className="block text-body-sm font-medium mb-1">Tool ID *</label><Input value={regForm.id} onChange={e => setRegForm(f => ({...f, id: e.target.value}))} placeholder="T-XXXX" /></div>
              <div><label className="block text-body-sm font-medium mb-1">Type *</label><Input value={regForm.type} onChange={e => setRegForm(f => ({...f, type: e.target.value}))} placeholder="e.g. Torque Wrench" /></div>
              <div><label className="block text-body-sm font-medium mb-1">Location</label><Input value={regForm.location} onChange={e => setRegForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Stn 14" /></div>
              <div><label className="block text-body-sm font-medium mb-1">Next Calibration</label><Input type="date" value={regForm.nextCalib} onChange={e => setRegForm(f => ({...f, nextCalib: e.target.value}))} /></div>
              <div><label className="block text-body-sm font-medium mb-1">Max Cycle Life</label><Input type="number" value={regForm.maxCycle} onChange={e => setRegForm(f => ({...f, maxCycle: e.target.value}))} placeholder="10000" /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setShowRegister(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={registerTool}>Register</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
