import { useState } from 'react'
import { Bell, CheckCircle, XCircle, AlertTriangle, Info, Filter } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
type AlertStatus = 'active' | 'acknowledged' | 'dismissed'

interface Alert {
  id: number
  severity: Severity
  title: string
  message: string
  source: string
  time: string
  status: AlertStatus
}

const INITIAL_ALERTS: Alert[] = [
  { id: 1, severity: 'critical', title: 'SLA Breach — AND-9042', message: 'Robot Arm Jam at Stn 14 has exceeded the 60-minute SLA. Escalation required.', source: 'Andon System', time: '10:14 AM', status: 'active' },
  { id: 2, severity: 'high', title: 'Stockout: PUMP-V2-ASSY', message: 'Coolant Pump Assembly (CNC) is at zero stock. Active breakdown TKT-8992 requires this part.', source: 'Inventory', time: '09:55 AM', status: 'active' },
  { id: 3, severity: 'high', title: 'OEE Below Threshold — Paint Line B', message: 'OEE dropped to 74% (threshold: 80%). Cause: Robot Arm Fault downtime.', source: 'OEE Monitor', time: '09:30 AM', status: 'active' },
  { id: 4, severity: 'medium', title: 'Reorder Alert: SENS-PROX-8M', message: 'Proximity Sensor 8mm PNP at 4 units (min: 10). Reorder suggested.', source: 'Inventory', time: '08:45 AM', status: 'active' },
  { id: 5, severity: 'medium', title: 'NCR Pending Disposition', message: 'D-8826 (Missing Torque Spec, EL-884B) has no disposition set. Quality action required.', source: 'Quality Gate', time: '08:20 AM', status: 'active' },
  { id: 6, severity: 'low', title: 'Shift Handover Overdue', message: 'Shift A→B handover form not yet submitted. Due at 14:00.', source: 'Shift Manager', time: '07:50 AM', status: 'active' },
  { id: 7, severity: 'info', title: 'WO-44924-A Released', message: 'Work order WO-44924-A (CHG-112-EV) released to production line.', source: 'Work Orders', time: '07:30 AM', status: 'acknowledged' },
]

const SEV_CONFIG: Record<Severity, { icon: any; bg: string; text: string; badge: string }> = {
  critical: { icon: XCircle,       bg: 'bg-red-50 border-red-300',     text: 'text-red-700',    badge: 'bg-red-600 text-white' },
  high:     { icon: AlertTriangle, bg: 'bg-orange-50 border-orange-300', text: 'text-orange-700', badge: 'bg-orange-500 text-white' },
  medium:   { icon: AlertTriangle, bg: 'bg-yellow-50 border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-400 text-black' },
  low:      { icon: Bell,          bg: 'bg-gray-50 border-gray-300',   text: 'text-gray-700',   badge: 'bg-gray-400 text-white' },
  info:     { icon: Info,          bg: 'bg-blue-50 border-blue-300',   text: 'text-blue-700',   badge: 'bg-blue-500 text-white' },
}

export function SystemAlertsPage() {
  const toast = useToast()
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('all')
  const [sevFilter, setSevFilter] = useState('all')

  const acknowledge = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? {...a, status: 'acknowledged'} : a))
    toast('Alert acknowledged', 'success')
  }

  const dismiss = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? {...a, status: 'dismissed'} : a))
    toast('Alert dismissed', 'info')
  }

  const acknowledgeAll = () => {
    setAlerts(prev => prev.map(a => a.status === 'active' ? {...a, status: 'acknowledged'} : a))
    toast('All active alerts acknowledged', 'success')
  }

  const displayed = alerts.filter(a => {
    if (a.status === 'dismissed') return false
    if (filter !== 'all' && a.status !== filter) return false
    if (sevFilter !== 'all' && a.severity !== sevFilter) return false
    return true
  })

  const activeCount = alerts.filter(a => a.status === 'active').length
  const criticalCount = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl flex items-center gap-3">
            System Alerts
            {activeCount > 0 && <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeCount} ACTIVE</span>}
          </h1>
          <p className="text-body text-text-secondary">
            {criticalCount > 0 && <span className="text-red-600 font-semibold">{criticalCount} critical · </span>}
            Across all modules
          </p>
        </div>
        <Button variant="outline" onClick={acknowledgeAll} disabled={activeCount === 0}>
          Acknowledge All ({activeCount})
        </Button>
      </div>

      <Card className="p-4 flex gap-3">
        <div className="flex bg-surface border border-border rounded-lg overflow-hidden text-body-sm">
          {(['all','active','acknowledged'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${filter === f ? 'bg-accent text-white shadow-lg shadow-accent/20 rounded-md' : 'hover:bg-primary text-text-secondary rounded-md'}`}>
              {f}
            </button>
          ))}
        </div>
        <Select value={sevFilter} onChange={e => setSevFilter(e.target.value)}
          options={[{label:'All Severities',value:'all'},{label:'Critical',value:'critical'},{label:'High',value:'high'},{label:'Medium',value:'medium'},{label:'Low',value:'low'},{label:'Info',value:'info'}]} />
        <span className="text-body-sm text-text-muted self-center">{displayed.length} showing</span>
      </Card>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {displayed.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-text-muted">No alerts match the current filter.</div>
        )}
        {displayed.map(alert => {
          const cfg = SEV_CONFIG[alert.severity]
          const Icon = cfg.icon
          return (
            <div key={alert.id} className={`border rounded-xl p-4 flex gap-4 items-start ${cfg.bg} ${alert.status === 'acknowledged' ? 'opacity-60' : ''}`}>
              <Icon size={20} className={cfg.text}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase ${cfg.badge}`}>{alert.severity}</span>
                  <span className="font-semibold text-body">{alert.title}</span>
                  {alert.status === 'acknowledged' && <span className="text-xs text-green-600 font-medium">✓ Acknowledged</span>}
                </div>
                <p className="text-body-sm text-text-secondary mb-2">{alert.message}</p>
                <div className="flex items-center gap-3 text-body-xs text-text-muted">
                  <span>Source: {alert.source}</span>
                  <span>·</span>
                  <span>{alert.time}</span>
                </div>
              </div>
              {alert.status === 'active' && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => acknowledge(alert.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-body-sm font-medium hover:bg-gray-50 transition-colors">
                    <CheckCircle size={14} className="text-green-600"/> Ack
                  </button>
                  <button onClick={() => dismiss(alert.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-body-sm font-medium hover:bg-gray-50 transition-colors">
                    <XCircle size={14} className="text-gray-500"/> Dismiss
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
