import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'

export function LiveAssemblyFeedPage() {
  const toast = useToast()
  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">Live Assembly Feed</h1>
          <p className="text-body text-text-secondary">Line 1 • Chassis Marriage</p>
        </div>
        <Button variant="andon" size="lg" iconLeft={<AlertTriangle size={20}/>} onClick={() => toast('Critical Andon event raised for Line 1!', 'error')}>ANDON RAISE</Button>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-label text-text-secondary uppercase mb-2">LINE EFFICIENCY</div>
          <div className="text-kpi flex items-baseline gap-2">
            94.2% <span className="text-heading-md text-green-600">+1.2%</span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-label text-text-secondary uppercase mb-2">JOBS COMPLETED TODAY</div>
          <div className="text-kpi">
            342 <span className="text-heading-md text-text-muted font-normal">/ 400 target</span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-label text-text-secondary uppercase mb-2">ANDON EVENTS</div>
          <div className="text-kpi flex items-baseline gap-2">
            2 <span className="text-heading-md text-text-muted font-normal">Active: 0</span>
          </div>
        </Card>
      </div>

      {/* STATION GRID */}
      <div className="grid grid-cols-4 gap-4 flex-1">
        <StationCard 
          id="STN-010" 
          process="Harness Routing" 
          status="running" 
          takt="00:42" 
          target="00:45" 
          op="OP-4921" 
          signoff="10:42 AM" 
        />
        <StationCard 
          id="STN-020" 
          process="Engine Drop" 
          status="running" 
          takt="00:44" 
          target="00:45" 
          op="OP-8812" 
          signoff="10:43 AM" 
        />
        <StationCard 
          id="STN-030" 
          process="Transmission Mount" 
          status="delayed" 
          takt="-00:14" 
          target="00:45" 
          op="OP-8820" 
          hold="Hold: QC Check"
        />
        <StationCard 
          id="STN-040" 
          process="Drive Shaft Install" 
          status="idle" 
          takt="00:00" 
          target="00:45" 
          op="--" 
          signoff="--" 
        />
      </div>
    </div>
  )
}

function StationCard({ id, process, status, takt, target, op, signoff, hold }: any) {
  const isRunning = status === 'running'
  const isDelayed = status === 'delayed'
  const isIdle = status === 'idle'

  return (
    <Card className={`p-4 flex flex-col ${
      isRunning ? 'bg-white' : 
      isDelayed ? 'bg-red-50 border-red-300' : 
      'bg-gray-50 border-gray-200 opacity-80'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`font-bold ${isIdle ? 'text-gray-500' : 'text-text-primary'}`}>
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-green-500' : isDelayed ? 'bg-red-600' : 'bg-gray-400'}`} />
          {id}
        </div>
        <div className={`text-body-xs font-bold px-2 py-0.5 rounded ${
          isRunning ? 'text-green-700 bg-green-100' : 
          isDelayed ? 'text-red-700 bg-red-100' : 
          'text-gray-600 bg-gray-200'
        }`}>
          {isRunning ? '● Running' : isDelayed ? '● Delay' : '● Idle'}
        </div>
      </div>

      <div className="text-label text-text-secondary uppercase mb-1">CURRENT OPERATION</div>
      <div className="text-heading-sm mb-4 line-clamp-1" title={process}>{process}</div>

      <div className={`rounded-lg p-3 mt-auto ${isDelayed ? 'bg-red-100' : 'bg-surface'}`}>
        <div className="flex justify-between text-body-sm mb-1">
          <span className={isDelayed ? 'text-red-800' : 'text-text-secondary'}>Takt Time</span>
          <span className={isDelayed ? 'text-red-800' : 'text-text-secondary'}>Target</span>
        </div>
        <div className="flex justify-between items-end">
          <span className={`font-mono text-heading-xl leading-none ${
            isDelayed ? 'text-red-600 animate-pulse' : 
            isIdle ? 'text-text-muted' : 
            'text-green-600'
          }`}>{takt}</span>
          <span className={`font-mono text-heading-sm ${isDelayed ? 'text-red-700' : 'text-text-secondary'}`}>{target}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-body-sm pt-3 border-t border-border">
        <span className="text-text-secondary font-medium flex items-center gap-1.5">👤 {op}</span>
        {hold ? (
          <span className="text-red-600 font-bold">{hold}</span>
        ) : (
          <span className="text-text-muted">Sign-off: {signoff}</span>
        )}
      </div>
    </Card>
  )
}
