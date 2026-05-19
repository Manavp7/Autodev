import React from 'react'
import { TrendingUp, Clock, Bell, AlertTriangle, Filter, CheckCircle, ArrowLeftRight, Wrench, Zap, Activity, TrendingDown } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import type { ProductionLine } from '../types'
import { useLiveStore } from '../stores/liveStore'
import { useAppStore } from '../stores/appStore'
import { useQuery } from '@tanstack/react-query'
import { operationsApi } from '../api'
import { useToast } from '../components/ui/Toast'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  subtext?: string
  trend?: number
  icon: any
  color: string
  reverseTrend?: boolean
  alert?: boolean
}

function KpiCard({ title, value, subtext, trend, icon: Icon, color, reverseTrend, alert }: KpiCardProps) {
  const isPositive = trend !== undefined ? trend > 0 : true
  const isGood = reverseTrend ? !isPositive : isPositive

  return (
    <div className="glass-hover relative overflow-hidden group p-5 rounded-xl transition-all hover:-translate-y-1 cursor-default">
      {/* Alert glow for stopped lines */}
      {alert && <div className="absolute inset-0 rounded-xl border-2 border-danger/50 animate-pulse pointer-events-none" />}

      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">{title}</p>
          <h4 className="text-2xl font-black text-text-primary mt-2 flex items-baseline gap-2 tabular-nums tracking-tighter">
            {value}
            {subtext && <span className="text-[10px] font-bold text-text-secondary lowercase">{subtext}</span>}
          </h4>
        </div>
        <div className={cn("p-3 rounded-2xl bg-surface border border-border-dark shadow-inner shrink-0 group-hover:scale-110 transition-transform", color)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-3 relative z-10">
          <span className={cn(
            "flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black border",
            isGood ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tight opacity-50">vs last shift</span>
        </div>
      )}

      {/* Decorative circle */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-full translate-x-12 translate-y-12 group-hover:scale-150 transition-transform" />
    </div>
  )
}

export function OperationsDashboardPage() {
  const toast = useToast()
  const { openDetail } = useAppStore()
  
  // Fetch initial KPI from API
  const { data: apiKpi } = useQuery({
    queryKey: ['kpi'],
    queryFn: operationsApi.getKpi,
    refetchInterval: 30_000,
  })

  // Fetch initial lines from API
  const { data: apiLines } = useQuery({
    queryKey: ['lines'],
    queryFn: operationsApi.getLines,
    refetchInterval: 30_000,
  })

  // Override with live WebSocket data when available
  const liveKpi = useLiveStore(s => s.kpi)
  const liveLines = useLiveStore(s => s.lines)
  const recentAndon = useLiveStore(s => s.recentAndonEvents)

  const kpi = liveKpi ?? apiKpi
  const lines: ProductionLine[] = (liveLines.length ? liveLines : apiLines) ?? []

  const planPct = kpi ? Math.round((kpi.planActual / kpi.planTarget) * 100) : 0

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Page Header Pattern */}
      <div className="flex-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Operations Dashboard</h1>
          <p className="text-xs text-text-secondary mt-1">Real-time shop floor performance and line status.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm font-medium hover:border-accent transition-all">
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Plan vs Actual"
          value={kpi?.planActual.toLocaleString() ?? '—'}
          subtext={`/ ${kpi?.planTarget.toLocaleString() ?? '—'}`}
          trend={kpi ? planPct - 100 : undefined}
          icon={TrendingUp}
          color="text-accent"
        />
        <KpiCard
          title="Plant OEE"
          value={`${kpi?.oee ?? '—'}%`}
          trend={kpi ? Number((kpi.oee - kpi.oeeTarget).toFixed(1)) : undefined}
          icon={Activity}
          color="text-success"
          reverseTrend={true}
        />
        <KpiCard
          title="Andon Events"
          value={kpi?.andonEventsToday ?? '—'}
          subtext="Today"
          icon={Bell}
          color="text-warning"
        />
        <KpiCard
          title="Active Breakdowns"
          value={kpi?.activeBreakdowns ?? '—'}
          subtext={`Lines Stopped: ${kpi?.linesStopped ?? '0'}`}
          icon={AlertTriangle}
          color="text-danger"
          alert={kpi ? kpi.linesStopped > 0 : false}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
        {/* LINE STATUS */}
        <Card glass className="col-span-1 xl:col-span-3 flex flex-col min-h-0 !p-0 overflow-hidden">
          <div className="p-4 border-b border-border-dark flex items-center justify-between bg-primary/20">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Line Status</h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] font-black text-success uppercase tracking-widest">Live</span>
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto">
            {lines.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-48 text-text-secondary">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Loading live line data…</span>
                </div>
              </div>
            ) : (
              lines.map(line => <LineStatusCard key={line.id} line={line} onClick={() => openDetail('MACHINE', line.id, line)} />)
            )}
          </div>
        </Card>

        {/* ANDON FEED */}
        <Card glass className="col-span-1 flex flex-col h-full !p-0 overflow-hidden">
          <div className="p-4 border-b border-border-dark flex justify-between items-center bg-primary/20">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Live Andon</h3>
            <button className="text-text-secondary hover:text-accent transition-colors" onClick={() => toast('Filter options opened', 'info')}><Filter size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border-dark">
            {recentAndon.length === 0 ? (
              <div className="p-6 text-center text-text-secondary text-sm font-medium">No recent andon events</div>
            ) : (
              recentAndon.map(event => (
                <AndonItem
                  key={event.id}
                  type={event.type}
                  title={event.title}
                  desc={event.description}
                  time={formatTime(event.raisedAt)}
                  onClick={() => openDetail('ANDON', event.id, event)}
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

function LineStatusCard({ line, onClick }: { line: ProductionLine, onClick: () => void }) {
  const isRunning = line.status === 'running'
  const isStopped = line.status === 'stopped'
  const eff = line.oee

  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-hover p-4 cursor-pointer relative overflow-hidden",
        isStopped && "border-danger shadow-[0_0_15px_rgba(239,68,68,0.1)]"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-text-primary">{line.name}</h3>
          <div className="text-xs font-medium text-text-secondary mt-0.5 tracking-wide">{line.currentWo} • {line.category}</div>
        </div>
        <Badge status={line.status as any} className="capitalize">
          {line.status}
        </Badge>
      </div>

      {isStopped && line.faultDescription && (
        <div className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-3 py-2 flex items-center gap-2 mb-3 text-xs font-bold">
          <Wrench size={14} />
          {line.faultDescription}
          <span className="ml-auto flex items-center gap-1"><Clock size={12} />{line.downtimeMinutes}m</span>
        </div>
      )}

      <div className="bg-surface rounded-lg p-3 space-y-2 border border-border-dark">
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary font-medium">Takt: <span className="text-text-primary font-bold">{line.taktActual || '—'}s</span></span>
          <span className="text-text-secondary font-medium">Target: <span className="text-text-primary font-bold">{line.taktTarget}s</span></span>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-text-secondary font-medium">Output: <span className="text-text-primary font-bold">{line.outputActual} / {line.outputTarget}</span></span>
          <span className={cn("font-black px-2 py-0.5 rounded-full border", eff >= 95 ? 'bg-success/10 text-success border-success/20' : eff >= 80 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-danger/10 text-danger border-danger/20')}>
            {eff}%
          </span>
        </div>
      </div>
    </div>
  )
}

function AndonItem({ type, title, desc, time, onClick }: { type: string; title: string; desc: string; time: string, onClick: () => void }) {
  const icons: Record<string, { icon: any; bg: string; color: string }> = {
    fault:    { icon: AlertTriangle, bg: 'bg-danger/10',    color: 'text-danger' },
    quality:  { icon: Zap,           bg: 'bg-accent/10',    color: 'text-accent' },
    shortage: { icon: Bell,          bg: 'bg-warning/10',   color: 'text-warning' },
    time:     { icon: Clock,         bg: 'bg-warning/10',   color: 'text-warning' },
    handover: { icon: ArrowLeftRight,bg: 'bg-surface',      color: 'text-text-primary' },
    safety:   { icon: AlertTriangle, bg: 'bg-danger/10',    color: 'text-danger' },
  }
  const config = icons[type] ?? icons.fault
  const Icon = config.icon

  return (
    <div onClick={onClick} className="flex gap-3 p-4 hover:bg-surface cursor-pointer transition-colors group">
      <div className={cn(`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border group-hover:scale-110 transition-transform`, config.bg, config.color, config.color.replace('text-', 'border-')+'/20')}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-sm text-text-primary truncate pr-2 group-hover:text-accent transition-colors">{title}</h4>
          <span className="text-[10px] font-bold text-text-secondary flex-shrink-0 whitespace-nowrap">{time}</span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
