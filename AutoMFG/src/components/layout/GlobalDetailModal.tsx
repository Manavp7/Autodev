import React from 'react'
import { X, Download, FileText, Activity, AlertTriangle, PenTool } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'
import { cn } from '@/lib/utils'

export function GlobalDetailModal() {
  const { detailOpen, detailType, detailId, closeDetail } = useAppStore()

  if (!detailOpen || !detailType) return null

  const getEntityTitle = () => {
    switch (detailType) {
      case 'WORK_ORDER': return 'Work Order Detail'
      case 'MACHINE': return 'Machine Profile'
      case 'ANDON': return 'Andon Event'
      case 'QUALITY_DEFECT': return 'Quality Record'
      default: return 'Detail'
    }
  }

  const getEntityIcon = () => {
    switch (detailType) {
      case 'WORK_ORDER': return <FileText className="w-5 h-5" />
      case 'MACHINE': return <PenTool className="w-5 h-5" />
      case 'ANDON': return <AlertTriangle className="w-5 h-5" />
      case 'QUALITY_DEFECT': return <Activity className="w-5 h-5" />
      default: return null
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={closeDetail}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-[520px] bg-surface border-l border-border-dark shadow-2xl z-[101] flex flex-col transform transition-transform duration-300",
        detailOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-border-dark flex items-center justify-between shrink-0 bg-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              {getEntityIcon()}
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{getEntityTitle()}</p>
              <h2 className="text-xl font-black text-text-primary mt-1 font-mono">{detailId}</h2>
            </div>
          </div>
          <button 
            onClick={closeDetail}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-dark px-6 shrink-0 bg-surface">
          {['Overview', 'Performance', 'History', 'Documents'].map((tab, i) => (
            <button 
              key={tab}
              className={cn(
                "px-4 py-3 text-sm font-bold border-b-2 transition-colors",
                i === 0 
                  ? "border-accent text-accent" 
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-dark"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content (Mocked) */}
        <div className="flex-1 overflow-y-auto p-6 bg-primary">
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-sm font-bold text-text-primary mb-4">Summary Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Status</p>
                  <p className="text-sm font-medium text-text-primary mt-1">Active / Running</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Assigned To</p>
                  <p className="text-sm font-medium text-text-primary mt-1">Line 3 - Assembly</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Start Time</p>
                  <p className="text-sm font-medium text-text-primary mt-1">08:00 AM</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Duration</p>
                  <p className="text-sm font-medium text-text-primary mt-1">4h 15m</p>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-sm font-bold text-text-primary mb-4">Current Metrics</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex-between text-xs mb-1">
                    <span className="text-text-secondary">Completion Rate</span>
                    <span className="text-accent font-bold">78%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface border border-border-dark overflow-hidden">
                    <div className="h-full bg-accent w-[78%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-dark bg-surface flex items-center justify-between shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
            <Download size={16} /> Export CSV
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-surface border border-border-dark rounded-lg text-sm font-bold text-text-primary hover:border-accent transition-colors">
              Scorecard PDF
            </button>
            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(46,125,50,0.3)] hover:bg-accent/90 transition-colors">
              Primary Action
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
