import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  MoreVertical,
  ExternalLink,
  Info,
  Check, 
  Cloud,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  X as XIcon
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useEventBus } from '../stores/eventBus'
import { useAuthStore } from '../stores/authStore'
import { recordAudit } from '../lib/audit'

const APQPTracker = () => {
  const navigate = useNavigate()
  const emit = useEventBus((s) => s.emit)
  const userId = useAuthStore((s) => s.user?.id ?? 'unknown')

  const partNumber = '8042-PW-01'
  const supplierId = 'apex-automotive'

  const handleKickoffPpap = () => {
    emit({ type: 'ppap.kickoff', supplierId, partNumber })
    recordAudit({
      entity: 'PPAP',
      entityId: partNumber,
      action: 'KICKOFF_PPAP',
      userId,
      after: { supplierId },
    })
  }
  const elements = [
    { id: 1, name: 'Design Records', status: 'Complete' },
    { id: 2, name: 'Eng Change Documents', status: 'Complete' },
    { id: 3, name: 'Customer Eng Approval', status: 'Approved' },
    { id: 4, name: 'Design FMEA (DFMEA)', status: 'Approved' },
    { id: 5, name: 'Process Flow Diagram', status: 'In Progress' },
    { id: 6, name: 'Process FMEA (PFMEA)', status: 'Not Started' },
    { id: 7, name: 'Control Plan', status: 'Not Started' },
    { id: 8, name: 'MSA Studies', status: 'Not Required' },
    { id: 9, name: 'Dimensional Results', status: 'Not Started' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-1">
            <span className="hover:text-accent cursor-pointer" onClick={() => navigate('/programs')}>Project Alpha-X</span> <ChevronRight size={12} /> <span>Powertrain Module</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">APQP / PPAP Tracker</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 border border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:bg-primary">Export PDF</button>
          <button
            onClick={handleKickoffPpap}
            className="px-6 py-2.5 border border-accent text-accent rounded-lg text-sm font-bold hover:bg-accent/10"
          >
            Kick-off PPAP
          </button>
          <button 
            onClick={() => navigate('/programs')}
            className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-accent/90"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="card p-6 grid grid-cols-5 gap-8 bg-primary/30">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Part Number</label>
          <p className="font-bold text-text-primary">8042-PW-01</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Supplier</label>
          <p className="font-bold text-text-primary">Apex Automotive Ltd.</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Overall Status</label>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase border border-amber-100">In Progress 65%</span>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">PPAP Level</label>
          <select className="bg-transparent font-bold text-text-primary outline-none text-sm cursor-pointer">
            <option>Level 3 (Default)</option>
            <option>Level 1</option>
            <option>Level 5</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Approval Type</label>
          <div className="flex bg-surface p-1 rounded-lg border border-border-dark mt-1">
            <button className="flex-1 text-[9px] font-black uppercase py-1 bg-sidebar text-white rounded">Full</button>
            <button className="flex-1 text-[9px] font-black uppercase py-1 text-text-secondary">Interim</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Elements Checklist */}
        <div className="lg:col-span-2 card flex flex-col h-[600px]">
          <div className="p-6 border-b border-border-dark flex justify-between items-center bg-primary/50">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">APQP Elements</h3>
            <span className="text-[10px] font-bold text-text-secondary uppercase">4 / 18 Complete</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {elements.map((el) => (
              <div 
                key={el.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border border-transparent hover:border-border-dark hover:bg-primary transition-all cursor-pointer group",
                  el.status === 'In Progress' && "bg-teal-50/30 border-teal-100"
                )}
              >
                <div className="flex items-center gap-4">
                  {el.status === 'Complete' || el.status === 'Approved' ? (
                    <CheckCircle2 size={18} className="text-accent" />
                  ) : el.status === 'In Progress' ? (
                    <Clock size={18} className="text-amber-500" />
                  ) : (
                    <Circle size={18} className="text-gray-200" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-text-primary">{el.name}</p>
                    <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mt-0.5">{el.status}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Evidence & Approval */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-8 bg-sidebar text-white relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Element 6: Process FMEA</h3>
                  <p className="text-xs text-navy-200">Required evidence for Level 3 submission</p>
                </div>
                <div className="px-3 py-1 bg-accent rounded text-[10px] font-black uppercase tracking-widest">Required</div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-navy-300 uppercase tracking-widest">Submission Status</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-red-400">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Awaiting Documents</p>
                      <p className="text-[10px] text-navy-300 uppercase font-black">Due in 4 Days</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-navy-300 uppercase tracking-widest">Review Team</h4>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-navy-900 bg-surface flex items-center justify-center text-[10px] font-bold">U{i}</div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-navy-900 bg-accent flex items-center justify-center text-[10px] font-bold">+</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full py-4 bg-accent hover:bg-accent/90 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-teal-500/20">
                  <Upload size={20} /> Upload Evidence Documents
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Cloud size={120} />
            </div>
          </div>

          <div className="card h-[310px] flex flex-col">
            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-primary/20">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Evidence History</h3>
              <button className="text-[10px] font-bold text-accent hover:underline">View All Documents</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {[
                  { name: 'PFMEA_Preliminary_Draft.pdf', size: '1.2 MB', date: 'May 12, 2024', status: 'In Review', uploader: 'Alex Rivera' },
                  { name: 'Process_Flow_V2.pdf', size: '840 KB', date: 'May 10, 2024', status: 'Approved', uploader: 'Sarah Jenkins', approved: 'Chief Engineer' },
                ].map((doc, i) => (
                  <div key={i} className="p-4 border border-border-dark rounded-xl space-y-4 hover:shadow-sm transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-primary">{doc.name}</p>
                          <p className="text-[10px] text-text-secondary font-bold uppercase">{doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"><Eye size={14} /></button>
                        <button className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"><Download size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                      {doc.status === 'Approved' ? (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-green-500 uppercase tracking-widest">
                          <ShieldCheck size={12} /> Approved by {doc.approved}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                          <Clock size={12} /> In Review
                        </div>
                      )}
                      {doc.status === 'In Review' && (
                        <div className="flex gap-2">
                          <button className="w-6 h-6 rounded bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"><Check size={14} /></button>
                          <button className="w-6 h-6 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><XIcon size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default APQPTracker
