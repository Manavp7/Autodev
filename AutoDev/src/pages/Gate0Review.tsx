import React from 'react'
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  FileText, 
  User, 
  Info, 
  AlertCircle,
  Clock,
  Check
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { useNavigate } from 'react-router-dom'

const Gate0Review = () => {
  const navigate = useNavigate()
  const [activeTRL, setActiveTRL] = React.useState(4)
  
  const trlDescriptions: Record<number, string> = {
    1: "Basic principles observed and reported.",
    2: "Technology concept and/or application formulated.",
    3: "Analytical and experimental critical function and/or characteristic proof of concept.",
    4: "Technology validated in lab environment. Component and/or breadboard validation in laboratory environment.",
    5: "Technology validated in relevant environment. Component and/or breadboard validation in relevant environment.",
    6: "Technology demonstrated in relevant environment. System/subsystem model or prototype demonstration in a relevant environment.",
    7: "System prototype demonstration in an operational environment.",
    8: "Actual system completed and qualified through test and demonstration.",
    9: "Actual system proven through successful mission operations."
  }

  const approvers = [
    { name: 'David Miller', title: 'VP Engineering', status: 'approved' },
    { name: 'Sarah Jenkins', title: 'Program Manager', status: 'pending' },
    { name: 'Alex Rivera', title: 'Chief Engineer', status: 'waiting' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Stepper */}
      <div className="max-w-4xl mx-auto px-8">
        <div className="relative flex justify-between">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-surface -z-10" />
          {[
            { label: 'Submitted', status: 'complete' },
            { label: 'Feasibility Study', status: 'complete' },
            { label: 'Gate 0 Review', status: 'active' },
            { label: 'Approved/Rejected', status: 'pending' },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-primary px-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step.status === 'active' ? "bg-sidebar text-white ring-4 ring-navy-900/10" :
                step.status === 'complete' ? "bg-accent text-white" : "bg-surface border-2 border-border-dark text-gray-300"
              )}>
                {step.status === 'complete' ? <Check size={16} /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest text-center",
                step.status === 'active' ? "text-text-primary" : "text-text-secondary"
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Initiation Request */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="p-6 border-b border-border-dark flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-accent">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Program Initiation Request</h2>
                <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Alpha SUV 2026 (PRG-8042)</p>
              </div>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Market Segment</label>
                <p className="font-bold text-text-primary">D-Segment SUV Electric</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Target Launch Date</label>
                <p className="font-bold text-text-primary">December 15, 2026</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Estimated Budget (CAPEX)</label>
                <p className="font-bold text-text-primary">$42,500,000.00</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Risk Level Assessment</label>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase mt-1">
                  <AlertCircle size={12} /> Medium Risk
                </span>
              </div>
              
              <div className="col-span-2 space-y-4">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Technology Readiness Level (TRL)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                    <button 
                      key={lvl}
                      onClick={() => setActiveTRL(lvl)}
                      type="button"
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded transition-all",
                        lvl === activeTRL ? "bg-accent text-white shadow-lg border border-accent" : "bg-primary text-text-secondary hover:bg-surface border border-transparent"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-teal-50 rounded-lg flex items-start gap-3">
                  <Info size={16} className="text-accent mt-0.5 shrink-0" />
                  <p className="text-xs text-teal-800 font-medium leading-relaxed">
                    <span className="font-bold uppercase mr-2">Level {activeTRL}:</span>
                    {trlDescriptions[activeTRL]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Feasibility Review */}
        <div className="space-y-6">
          <div className="card h-full">
            <div className="p-6 border-b border-border-dark flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-primary">Feasibility Review</h2>
              <span className="px-2 py-0.5 bg-teal-100 text-accent text-[10px] font-bold rounded uppercase flex items-center gap-1">
                <Clock size={12} /> In Progress
              </span>
            </div>

            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Approver Chain</h3>
                <div className="space-y-4">
                  {approvers.map((approver, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-[10px] font-bold">
                        {approver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-text-primary">{approver.name}</p>
                        <p className="text-[10px] text-text-secondary uppercase">{approver.title}</p>
                      </div>
                      {approver.status === 'approved' ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                      ) : approver.status === 'pending' ? (
                        <Clock size={18} className="text-amber-500" />
                      ) : (
                        <Circle size={18} className="text-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Reviewer Notes</label>
                <textarea 
                  rows={6} 
                  placeholder="Add feasibility constraints or remarks..."
                  className="w-full bg-primary border border-border-dark rounded-lg p-3 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => navigate('/programs')}
                  className="w-full py-3 bg-accent text-white rounded-lg font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                >
                  Submit Review <ArrowRight size={18} />
                </button>
                <button className="w-full py-3 bg-surface border border-border-dark text-text-primary rounded-lg font-bold text-sm hover:bg-primary transition-all">
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gate0Review
