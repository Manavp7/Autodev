import React from 'react'
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { cn } from '../utils/cn'
import { useEventBus } from '../stores/eventBus'
import { useAuthStore } from '../stores/authStore'
import { can } from '../lib/permissions'
import { recordAudit } from '../lib/audit'
import { Modal } from '../components/Modal'

const EngineeringChange = () => {
  const navigate = useNavigate()
  const currentStep = 3
  const emit = useEventBus((s) => s.emit)
  const role = useAuthStore((s) => s.user?.role)
  const userId = useAuthStore((s) => s.user?.id ?? 'unknown')
  const canApproveEco = can(role, 'APPROVE_ECO')

  const handleApproveEco = () => {
    const ecoId = `ECO-${Date.now().toString(36).toUpperCase()}`
    const affectedParts = ['PART-0012', 'PART-0013']
    const cutInDate = 'MY 2026'
    emit({ type: 'eco.approved', ecoId, affectedParts, cutInDate })
    recordAudit({
      entity: 'ECO',
      entityId: ecoId,
      action: 'APPROVE_ECO',
      userId,
      after: { affectedParts, cutInDate },
    })
    setGeneratedEcoId(ecoId)
  }
  const steps = [
    'CR Submitted',
    'Impact Assessment',
    'CFRB Review',
    'Approved',
    'Executed',
    'Verified',
    'ECN Published'
  ]

  const [crs, setCrs] = React.useState([
    { id: 'CR-4092', title: 'Battery Thermal Module Revision', priority: 'High', subsystem: 'Powertrain', date: 'May 12', status: 'Pending CFRB Review', initiator: 'Sarah Jenkins', targetCutIn: 'MY 2026', description: 'Revision of internal coolant routing to improve thermal dissipation at peak charge rates. Replacing current aluminum tubing with enhanced alloy for higher pressure resistance.', rationale: 'Validation tests showed slight pressure drop in high-temp cycles. New design ensures ISO 26262 safety margins are maintained during fast-charging scenarios.' },
    { id: 'CR-4088', title: 'Bumper Fascia Mounting Clips', priority: 'Medium', subsystem: 'Body Exterior', date: 'May 10', status: 'In Review', initiator: 'Mike R.', targetCutIn: 'MY 2025', description: 'Update clips to improve retention during assembly.', rationale: 'Assembly line reports intermittent clip failures.' },
    { id: 'CR-4075', title: 'Suspension Bushing Durometer', priority: 'Low', subsystem: 'Chassis', date: 'May 08', status: 'Approved', initiator: 'Alex T.', targetCutIn: 'MY 2025', description: 'Change durometer of lower control arm bushing.', rationale: 'Improve NVH characteristics.' },
  ])
  
  const [activeCrId, setActiveCrId] = React.useState('CR-4092')
  const activeCr = crs.find(c => c.id === activeCrId) || crs[0]

  const [generatedEcoId, setGeneratedEcoId] = React.useState<string | null>(null)
  const [rejectedCrId, setRejectedCrId] = React.useState<string | null>(null)

  const handleRejectCr = () => {
    setCrs(prev => prev.map(cr => cr.id === activeCrId ? { ...cr, status: 'Rejected' } : cr))
    setRejectedCrId(activeCrId)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Progress Stepper */}
      <div className="card p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
                  i + 1 === currentStep ? "bg-sidebar text-white shadow-lg ring-4 ring-navy-900/10" :
                  i + 1 < currentStep ? "bg-accent text-white" : "bg-surface text-text-secondary"
                )}>
                  {i + 1 < currentStep ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest text-center max-w-[80px]",
                  i + 1 === currentStep ? "text-text-primary" : "text-text-secondary"
                )}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("h-0.5 flex-1 mx-2", i + 1 < currentStep ? "bg-accent" : "bg-surface")} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Panel - CR List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-primary">Change Requests</h2>
            <span className="px-2 py-0.5 bg-surface text-text-secondary text-[10px] font-bold rounded">12 Active</span>
          </div>
          
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input type="text" placeholder="CR-XXXX..." className="w-full bg-surface border border-border-dark rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:border-accent" />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-0.5 bg-teal-50 text-accent text-[9px] font-bold rounded-full flex items-center gap-1 border border-teal-100">Pending CFRB <X size={10} className="cursor-pointer" /></span>
            <span className="px-2 py-0.5 bg-primary text-text-secondary text-[9px] font-bold rounded-full flex items-center gap-1 border border-border-dark">High Priority <X size={10} className="cursor-pointer" /></span>
          </div>

          <div className="space-y-3 h-[calc(100vh-400px)] overflow-y-auto pr-1">
            {crs.map((cr) => (
              <div 
                key={cr.id}
                onClick={() => setActiveCrId(cr.id)}
                className={cn(
                  "card p-4 space-y-3 cursor-pointer transition-all border-l-4 group",
                  cr.id === activeCrId ? "border-accent bg-teal-50/10 shadow-md" : "border-transparent hover:bg-primary"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{cr.id}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                    cr.priority === 'High' ? "bg-red-50 text-red-500" : cr.priority === 'Medium' ? "bg-amber-50 text-amber-500" : "bg-green-50 text-green-600"
                  )}>
                    {cr.priority} Priority
                  </span>
                </div>
                <h4 className={cn("text-xs font-bold leading-relaxed", cr.id === activeCrId ? "text-text-primary" : "text-text-secondary")}>{cr.title}</h4>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-text-secondary font-bold uppercase">{cr.subsystem}</span>
                  <span className="text-text-secondary">{cr.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - CR Detail */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-8 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">{activeCr.id}: {activeCr.title}</h1>
                  <span className={cn(
                    "px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border",
                    activeCr.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                    activeCr.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  )}>
                    {activeCr.status === 'Rejected' ? <AlertCircle size={12} /> : activeCr.status === 'Approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {activeCr.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs font-bold text-text-secondary uppercase tracking-widest">
                  <div className="flex items-center gap-2">Initiator: <span className="text-text-primary">{activeCr.initiator}</span></div>
                  <div className="flex items-center gap-2">Subsystem: <span className="text-text-primary">{activeCr.subsystem}</span></div>
                  <div className="flex items-center gap-2">Target Cut-in: <span className="text-text-primary">{activeCr.targetCutIn}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => alert('Request Info feature is coming soon!')} className="px-4 py-2 border border-border-dark rounded-lg text-xs font-bold text-text-secondary hover:bg-primary">Request Info</button>
                <button type="button" onClick={handleRejectCr} className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-xs font-bold hover:bg-red-50">Reject CR</button>
                <button 
                  onClick={handleApproveEco}
                  title="Approve and broadcast ECO downstream"
                  className="px-6 py-2 rounded-lg text-xs font-bold transition-all bg-accent text-white shadow-lg shadow-teal-500/20 hover:bg-accent/90"
                >
                  Approve & Generate ECO
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2"><Info size={12} /> Change Description</h3>
                <div className="p-4 bg-primary rounded-xl text-xs text-text-secondary leading-relaxed min-h-[120px]">
                  {activeCr.description}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12} /> Rationale</h3>
                <div className="p-4 bg-primary rounded-xl text-xs text-text-secondary leading-relaxed min-h-[120px]">
                  {activeCr.rationale}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Impact Assessment</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Tooling Cost', value: '+$12,500', color: 'text-red-500' },
                  { label: 'Piece Price', value: '+$4.20', color: 'text-red-500' },
                  { label: 'Timing Impact', value: '+2 Weeks', color: 'text-red-500' },
                  { label: 'Mass Impact', value: '+142g', color: 'text-red-500' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-primary p-4 rounded-xl text-center space-y-1">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{kpi.label}</p>
                    <p className={cn("text-lg font-black", kpi.color)}>{kpi.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Affected Items</h3>
                <button 
                  onClick={() => navigate('/bom')}
                  className="text-[10px] font-bold text-accent hover:underline"
                >
                  Add Items...
                </button>
              </div>
              <div className="border border-border-dark rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-primary text-[9px] font-black text-text-secondary uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-3">Part/Doc No.</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Rev</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { id: 'PART-0012', type: 'Component', rev: 'A → B', status: 'Checked In' },
                      { id: 'SPEC-8821', type: 'Document', rev: 'D → E', status: 'Pending Update' },
                    ].map((item, i) => (
                      <tr key={i} className="text-xs">
                        <td className="px-6 py-3 font-bold text-text-primary">{item.id}</td>
                        <td className="px-6 py-3 text-text-secondary">{item.type}</td>
                        <td className="px-6 py-3 font-mono font-bold text-accent">{item.rev}</td>
                        <td className="px-6 py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest",
                            item.status === 'Checked In' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">CFRB Vote Status</h3>
              <div className="flex items-center gap-8">
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500" style={{ width: '60%' }} />
                  <div className="h-full bg-red-500" style={{ width: '20%' }} />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-600"><ThumbsUp size={14} /> 6 Approve</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-500"><ThumbsDown size={14} /> 2 Reject</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary"><Clock size={14} /> 2 Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!generatedEcoId}
        onClose={() => {
          setGeneratedEcoId(null)
          navigate('/gate-approvals')
        }}
        title="ECO Generated"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-accent mb-2">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-primary">Successfully Generated</h3>
            <p className="text-sm text-text-secondary">
              Successfully approved and generated ECO
            </p>
            <div className="bg-surface border border-border-dark px-4 py-2 rounded-lg mt-4 w-full">
              <p className="text-xs font-black text-text-secondary uppercase tracking-widest mb-1">ECO ID</p>
              <p className="text-lg font-bold text-accent">{generatedEcoId}</p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => {
                setGeneratedEcoId(null)
                navigate('/gate-approvals')
              }}
              className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-accent/90 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!rejectedCrId}
        onClose={() => setRejectedCrId(null)}
        title="CR Rejected"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-primary">Successfully Rejected</h3>
            <p className="text-sm text-text-secondary">
              Successfully rejected {rejectedCrId}
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => setRejectedCrId(null)}
              className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-accent/90 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const X = ({ className, size = 16 }: { className?: string, size?: number }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>

export default EngineeringChange
