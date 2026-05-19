import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Check, 
  X, 
  FileText, 
  User, 
  Download,
  MoreVertical,
  ExternalLink,
  Info,
  ShieldCheck
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion, AnimatePresence } from 'framer-motion'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ApprovalRow = ({ approval }: any) => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = React.useState(false)
  
  return (
    <>
      <tr className={cn(
        "group cursor-pointer transition-all border-l-4",
        expanded ? "bg-teal-50/20 border-accent" : "border-transparent hover:bg-primary"
      )} onClick={() => setExpanded(!expanded)}>
        <td className="px-6 py-4">
          {expanded ? <ChevronDown size={16} className="text-accent" /> : <ChevronRight size={16} className="text-text-secondary" />}
        </td>
        <td className="px-6 py-4">
          <span className="px-2 py-1 bg-surface border border-border-dark text-text-primary text-[10px] font-black rounded uppercase tracking-widest">{approval.gate}</span>
        </td>
        <td className="px-6 py-4">
          <p className="text-sm font-bold text-text-primary">{approval.program}</p>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{approval.id}</p>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-[8px] font-bold">SJ</div>
            <span className="text-xs font-bold text-text-secondary">{approval.submittedBy}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-xs text-text-secondary font-medium">{approval.date}</td>
        <td className="px-6 py-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-primary bg-surface text-text-secondary flex items-center justify-center text-[8px] font-bold z-10">
                U{i}
              </div>
            ))}
            <div className="w-6 h-6 rounded-full border-2 border-primary bg-teal-50 text-accent flex items-center justify-center text-[8px] font-bold z-10">+2</div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className={cn(
            "flex items-center gap-2 text-xs font-black uppercase tracking-tighter",
            approval.overdue ? "text-red-500" : "text-text-secondary"
          )}>
            {approval.sla} {approval.overdue && <span className="px-1.5 py-0.5 bg-red-50 rounded text-[8px] tracking-widest">(Overdue)</span>}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="px-6 py-8 bg-surface border-b border-border-dark shadow-inner">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    Gate {approval.gate.split(' ')[1]} {approval.gateName} Approval Request
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Completion of all Design Verification tests for the Battery Enclosure assembly. Results have been reviewed by the Validation team and meet all OEM safety standards. All critical-path documents have been uploaded to the APQP tracker.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Attached Evidence</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'DV_Summary_Report_Final.pdf', size: '2.4 MB' },
                      { name: 'Gate_2_Readiness_Checklist.xlsx', size: '156 KB' },
                      { name: 'DFMEA_Review_Signoff.pdf', size: '840 KB' },
                    ].map((file, i) => (
                      <div key={i} className="p-4 border border-border-dark rounded-xl flex items-center justify-between hover:bg-primary transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-text-secondary group-hover:bg-teal-50 group-hover:text-accent transition-colors">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">{file.name}</p>
                            <p className="text-[10px] text-text-secondary font-bold uppercase">{file.size}</p>
                          </div>
                        </div>
                        <Download size={16} className="text-gray-300 group-hover:text-text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card p-6 bg-primary/50 border-border-dark shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-accent" />
                    <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">Manager Decision</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Approval Comments</label>
                    <textarea 
                      rows={4} 
                      placeholder="Required for rejection, optional for approval..."
                      className="w-full bg-surface border border-border-dark rounded-lg p-3 text-xs outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/programs')
                      }}
                      className="w-full py-3 bg-accent text-white rounded-lg font-bold text-xs shadow-lg shadow-teal-500/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={16} /> Approve Gate
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpanded(false)
                      }}
                      className="w-full py-3 bg-surface border border-red-200 text-red-500 rounded-lg font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                      <X size={16} /> Reject Gate
                    </button>
                    <button className="w-full py-2 text-[10px] font-black text-accent uppercase tracking-widest hover:underline text-center">
                      Request Additional Information
                    </button>
                  </div>

                  <div className="p-3 bg-surface rounded-lg border border-border-dark flex items-start gap-2">
                    <Info size={14} className="text-text-secondary mt-0.5" />
                    <p className="text-[10px] text-text-secondary leading-normal">
                      Approval will transition the program to the next APQP phase and notify all stakeholders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

const GateApprovalsHub = () => {
  const approvals = [
    { id: 'APP-9022', gate: 'Gate 2', gateName: 'Product Design', program: 'Alpha SUV 2026', submittedBy: 'Sarah Jenkins', date: 'May 12, 2024', sla: '2 Days Left', overdue: false },
    { id: 'APP-8841', gate: 'Gate 1', gateName: 'Concept Design', program: 'Delta Pickup X', submittedBy: 'Michael Chen', date: 'May 08, 2024', sla: 'Overdue', overdue: true },
    { id: 'APP-7721', gate: 'Gate 0', gateName: 'Feasibility', program: 'Sigma Compact', submittedBy: 'Elena Vance', date: 'May 14, 2024', sla: '4 Days Left', overdue: false },
    { id: 'APP-7722', gate: 'Gate 3', gateName: 'Process Design', program: 'Omega Sedan', submittedBy: 'David Lee', date: 'May 15, 2024', sla: '5 Days Left', overdue: false },
    { id: 'APP-7723', gate: 'Gate 4', gateName: 'Product Validation', program: 'Epsilon EV', submittedBy: 'Anna Croft', date: 'May 16, 2024', sla: '7 Days Left', overdue: false },
    { id: 'APP-7724', gate: 'Gate 5', gateName: 'Feedback & Assessment', program: 'Zeta Truck', submittedBy: 'Robert King', date: 'May 17, 2024', sla: '9 Days Left', overdue: false },
    { id: 'APP-7725', gate: 'Gate 1', gateName: 'Concept Design', program: 'Gamma Coupe', submittedBy: 'Lisa Ray', date: 'May 05, 2024', sla: 'Overdue', overdue: true },
    { id: 'APP-7726', gate: 'Gate 2', gateName: 'Product Design', program: 'Beta Crossover', submittedBy: 'Tom Hardy', date: 'May 18, 2024', sla: '3 Days Left', overdue: false },
    { id: 'APP-7727', gate: 'Gate 0', gateName: 'Feasibility', program: 'Theta Van', submittedBy: 'Julia Chen', date: 'May 19, 2024', sla: '8 Days Left', overdue: false },
    { id: 'APP-7728', gate: 'Gate 3', gateName: 'Process Design', program: 'Kappa Roadster', submittedBy: 'Chris Wong', date: 'May 20, 2024', sla: '6 Days Left', overdue: false },
    { id: 'APP-7729', gate: 'Gate 4', gateName: 'Product Validation', program: 'Iota Hatchback', submittedBy: 'Rachel Adams', date: 'May 21, 2024', sla: '10 Days Left', overdue: false },
    { id: 'APP-7730', gate: 'Gate 5', gateName: 'Feedback & Assessment', program: 'Nu Minivan', submittedBy: 'Kevin Smith', date: 'May 22, 2024', sla: '12 Days Left', overdue: false },
  ]

  const [currentPage, setCurrentPage] = React.useState(1)
  const [direction, setDirection] = React.useState(1)
  const itemsPerPage = 3
  const totalPages = Math.ceil(approvals.length / itemsPerPage)
  
  const handlePrev = () => {
    if (currentPage > 1) {
      setDirection(-1)
      setCurrentPage(prev => prev - 1)
    }
  }
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setDirection(1)
      setCurrentPage(prev => prev + 1)
    }
  }

  const paginatedApprovals = approvals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const overdueCount = approvals.filter(a => a.overdue).length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gate Approvals Hub</h1>
          <p className="text-text-secondary">Manage pending APQP gate transitions across active vehicle programs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} /> {overdueCount.toString().padStart(2, '0')} Overdue Approvals
          </div>
        </div>
      </div>

      <div className="card overflow-hidden relative">
        <table className="w-full text-left">
          <thead className="bg-primary/50 border-b border-border-dark">
            <tr className="text-[9px] font-black text-text-secondary uppercase tracking-widest">
              <th className="px-6 py-4 w-12"></th>
              <th className="px-6 py-4">Gate</th>
              <th className="px-6 py-4">Program</th>
              <th className="px-6 py-4">Submitted By</th>
              <th className="px-6 py-4">Submission Date</th>
              <th className="px-6 py-4">Pending Approver(s)</th>
              <th className="px-6 py-4">SLA Due Date</th>
            </tr>
          </thead>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.tbody
              key={currentPage}
              custom={direction}
              initial={{ opacity: 0, x: 50 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 * direction }}
              transition={{ duration: 0.3 }}
              className="divide-y divide-gray-50"
            >
              {paginatedApprovals.map((approval) => (
                <ApprovalRow key={approval.id} approval={approval} />
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
        <div className="p-4 bg-primary/20 border-t border-gray-50 flex justify-between items-center relative z-10">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, approvals.length)} of {approvals.length} pending approvals
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handlePrev} 
              disabled={currentPage === 1}
              className="p-2 bg-surface border border-border-dark rounded text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <button 
              onClick={handleNext} 
              disabled={currentPage === totalPages}
              className="p-2 bg-surface border border-border-dark rounded text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GateApprovalsHub
