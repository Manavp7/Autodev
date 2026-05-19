import { useState } from 'react'
import { Save, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useToast } from '../components/ui/Toast'

interface Toggle { id: string; label: string; description: string; value: boolean }
interface Setting { id: string; label: string; value: string; type?: string }

const INITIAL_TOGGLES: Toggle[] = [
  { id: 't1', label: 'Andon Auto-Escalation',       description: 'Automatically escalate Andon events that breach SLA to the next level',                  value: true  },
  { id: 't2', label: 'SLA Breach Alerts',            description: 'Send push notifications when any SLA timer breaches threshold',                          value: true  },
  { id: 't3', label: 'Shift Auto-Rollover',          description: 'Automatically roll over shift KPIs and reset counters at shift change time',             value: false },
  { id: 't4', label: 'WebSocket Live Feed',          description: 'Enable real-time WebSocket push for all live dashboards (disable to reduce server load)', value: true  },
  { id: 't5', label: 'Quality Gate Auto-Hold',       description: 'Automatically place work orders on hold when an NCR is raised against them',             value: false },
  { id: 't6', label: 'Inventory Auto-Reorder',       description: 'Automatically raise a purchase request when a part hits the reorder threshold',          value: true  },
]

const INITIAL_SETTINGS: Setting[] = [
  { id: 's1', label: 'Plant Name',           value: 'Detroit-04' },
  { id: 's2', label: 'Timezone',             value: 'America/Detroit' },
  { id: 's3', label: 'Shift A Start',        value: '06:00', type: 'time' },
  { id: 's4', label: 'Shift B Start',        value: '14:00', type: 'time' },
  { id: 's5', label: 'Shift C Start',        value: '22:00', type: 'time' },
  { id: 's6', label: 'Default OEE Target (%)', value: '85' },
  { id: 's7', label: 'SLA - Critical Andon (min)', value: '60' },
  { id: 's8', label: 'SLA - High Andon (min)',     value: '20' },
]

export function SystemConfigPage() {
  const toast = useToast()
  const [toggles, setToggles] = useState<Toggle[]>(INITIAL_TOGGLES)
  const [settings, setSettings] = useState<Setting[]>(INITIAL_SETTINGS)
  const [tab, setTab] = useState<'general' | 'sla' | 'notifications'>('general')
  const [dirty, setDirty] = useState(false)

  const flipToggle = (id: string) => {
    setToggles(prev => prev.map(t => {
      if (t.id !== id) return t
      const next = { ...t, value: !t.value }
      toast(`${next.label} ${next.value ? 'enabled' : 'disabled'}`, 'info')
      return next
    }))
    setDirty(true)
  }

  const updateSetting = (id: string, value: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, value } : s))
    setDirty(true)
  }

  const save = () => {
    toast('System configuration saved successfully', 'success')
    setDirty(false)
  }

  const reset = () => {
    setToggles(INITIAL_TOGGLES)
    setSettings(INITIAL_SETTINGS)
    setDirty(false)
    toast('Settings reset to defaults', 'warning')
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">System Configuration</h1>
          <p className="text-body text-text-secondary">Plant settings, SLA thresholds, and automation rules</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" iconLeft={<RefreshCw size={16}/>} onClick={reset}>Reset Defaults</Button>
          <Button variant="primary" iconLeft={<Save size={16}/>} onClick={save} disabled={!dirty}>
            {dirty ? 'Save Changes*' : 'Saved'}
          </Button>
        </div>
      </div>

      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
        {[{id:'general',label:'General'},{id:'sla',label:'SLA & Timers'},{id:'notifications',label:'Automation & Alerts'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-1 py-2 rounded-lg text-body-sm font-medium transition-colors ${tab === t.id ? 'bg-white shadow text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <Card className="p-6">
          <h3 className="text-heading-sm mb-4">Plant Settings</h3>
          <div className="grid grid-cols-2 gap-5">
            {settings.map(s => (
              <div key={s.id}>
                <label className="block text-body-sm font-medium mb-1">{s.label}</label>
                <Input type={s.type ?? 'text'} value={s.value} onChange={e => updateSetting(s.id, e.target.value)} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'sla' && (
        <Card className="p-6">
          <h3 className="text-heading-sm mb-4">SLA Thresholds</h3>
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Critical Andon SLA (min)', id: 'sla-crit', val: '60' },
              { label: 'High Andon SLA (min)',     id: 'sla-high', val: '20' },
              { label: 'Breakdown P1 SLA (min)',   id: 'sla-p1',   val: '30' },
              { label: 'Breakdown P2 SLA (min)',   id: 'sla-p2',   val: '120' },
              { label: 'NCR Disposition SLA (h)',  id: 'sla-ncr',  val: '24' },
              { label: 'OEE Report Interval (h)',  id: 'sla-oee',  val: '1' },
            ].map(s => (
              <div key={s.id}>
                <label className="block text-body-sm font-medium mb-1">{s.label}</label>
                <Input type="number" defaultValue={s.val} onChange={() => setDirty(true)} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card className="p-6">
          <h3 className="text-heading-sm mb-4">Automation & Notification Rules</h3>
          <div className="space-y-4">
            {toggles.map(t => (
              <div key={t.id} className="flex items-start justify-between py-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <div className="font-medium text-body">{t.label}</div>
                  <div className="text-body-sm text-text-muted mt-0.5">{t.description}</div>
                </div>
                <button onClick={() => flipToggle(t.id)} className="ml-4 shrink-0 flex items-center gap-2">
                  {t.value
                    ? <><ToggleRight size={28} className="text-forest-600"/><span className="text-green-600 text-body-sm font-medium">ON</span></>
                    : <><ToggleLeft size={28} className="text-gray-400"/><span className="text-gray-400 text-body-sm font-medium">OFF</span></>
                  }
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
