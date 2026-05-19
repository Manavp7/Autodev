import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart2, Download } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { useToast } from '../components/ui/Toast'

type Tab = 'overall' | 'availability' | 'performance' | 'quality'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overall', label: 'Overall OEE' },
  { id: 'availability', label: 'Availability' },
  { id: 'performance', label: 'Performance' },
  { id: 'quality', label: 'Quality Rate' },
]

const LINE_DATA = [
  { name: 'Assembly A1', oee: 97, avail: 99, perf: 98, qual: 99.8, trend: +2.1, shift: [97, 95, 98] },
  { name: 'Paint Line B', oee: 74, avail: 61, perf: 95, qual: 99.1, trend: -5.3, shift: [74, 80, 79] },
  { name: 'Trim Line C', oee: 82, avail: 88, perf: 88, qual: 97.5, trend: -1.2, shift: [82, 84, 81] },
  { name: 'Engine Marriage', oee: 98, avail: 99, perf: 99, qual: 99.9, trend: +0.8, shift: [98, 97, 99] },
]

const WEEK_DATA = [
  { label: 'Mon', oee: 91, avail: 95, perf: 96, qual: 99.3 },
  { label: 'Tue', oee: 89, avail: 93, perf: 95, qual: 99.1 },
  { label: 'Wed', oee: 87, avail: 91, perf: 94, qual: 99.0 },
  { label: 'Thu', oee: 88, avail: 92, perf: 95, qual: 99.2 },
  { label: 'Fri', oee: 85, avail: 90, perf: 93, qual: 98.9 },
  { label: 'Sat', oee: 82, avail: 87, perf: 92, qual: 98.8 },
  { label: 'Sun', oee: 79, avail: 85, perf: 90, qual: 98.5 },
]

function OeeBar({ value, target = 85, color }: { value: number; target?: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
        <div className={`h-4 rounded-full transition-all ${color}`} style={{ width: `${value}%` }}/>
        <div className="absolute top-0 h-4 border-l-2 border-dashed border-gray-600 opacity-50" style={{ left: `${target}%` }}/>
      </div>
      <span className="text-body-sm font-bold w-12 text-right">{value}%</span>
    </div>
  )
}

export function OeeAnalyticsPage() {
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('overall')
  const [period, setPeriod] = useState('week')
  const [lineFilter, setLineFilter] = useState('all')

  const filtered = lineFilter === 'all' ? LINE_DATA : LINE_DATA.filter(l => l.name === lineFilter)
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

  const getVal = (line: typeof LINE_DATA[0], t: Tab) => {
    if (t === 'overall') return line.oee
    if (t === 'availability') return line.avail
    if (t === 'performance') return line.perf
    if (t === 'quality') return line.qual
    return line.oee
  }

  const overallOee = avg(LINE_DATA.map(l => l.oee)).toFixed(1)

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">OEE Analytics</h1>
          <p className="text-body text-text-secondary">Overall Equipment Effectiveness - Plant Level</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onChange={e => setPeriod(e.target.value)}
            options={[{label:'This Week',value:'week'},{label:'This Month',value:'month'},{label:'Last Month',value:'lastmonth'}]} />
          <Button variant="outline" iconLeft={<Download size={16}/>} onClick={() => toast('OEE report exported to CSV', 'success')}>
            Export
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Overall OEE', value: `${overallOee}%`, target: '85%', good: parseFloat(overallOee) >= 85 },
          { label: 'Availability', value: `${avg(LINE_DATA.map(l => l.avail)).toFixed(1)}%`, target: '90%', good: true },
          { label: 'Performance', value: `${avg(LINE_DATA.map(l => l.perf)).toFixed(1)}%`, target: '95%', good: true },
          { label: 'Quality Rate', value: `${avg(LINE_DATA.map(l => l.qual)).toFixed(1)}%`, target: '99%', good: true },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="text-label uppercase text-text-muted mb-1">{s.label}</div>
            <div className={`text-kpi font-bold leading-none ${s.good ? 'text-green-600' : 'text-red-600'}`}>{s.value}</div>
            <div className="text-body-xs text-text-muted mt-1">Target: {s.target}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-body-sm font-medium transition-colors ${tab === t.id ? 'bg-white shadow text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 flex-1">
        {/* Line Breakdown */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-heading-sm">{TABS.find(t => t.id === tab)?.label} by Line</h3>
            <Select value={lineFilter} onChange={e => setLineFilter(e.target.value)}
              options={[{label:'All Lines',value:'all'}, ...LINE_DATA.map(l => ({label: l.name, value: l.name}))]} />
          </div>
          <div className="space-y-5">
            {filtered.map(line => {
              const val = getVal(line, tab)
              const color = val >= 85 ? 'bg-green-500' : val >= 70 ? 'bg-orange-400' : 'bg-red-500'
              return (
                <div key={line.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-body-sm">{line.name}</span>
                    <div className="flex items-center gap-2 text-body-xs">
                      {line.trend > 0
                        ? <span className="text-green-600 flex items-center gap-0.5"><TrendingUp size={12}/> +{line.trend}%</span>
                        : <span className="text-red-600 flex items-center gap-0.5"><TrendingDown size={12}/> {line.trend}%</span>
                      }
                    </div>
                  </div>
                  <OeeBar value={val} color={color} />
                  <div className="text-body-xs text-text-muted mt-0.5">
                    Shifts: A {line.shift[0]}% Â· B {line.shift[1]}% Â· C {line.shift[2]}%
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Trend Chart (bar chart) */}
        <Card className="p-4">
          <h3 className="text-heading-sm mb-4 flex items-center gap-2"><BarChart2 size={16}/> 7-Day Trend</h3>
          <div className="flex items-end gap-2 h-40">
            {WEEK_DATA.map(d => {
              const v = getVal({ oee: d.oee, avail: d.avail, perf: d.perf, qual: d.qual } as any, tab)
              const h = `${(v / 100) * 100}%`
              const color = v >= 85 ? 'bg-forest-500' : v >= 70 ? 'bg-orange-400' : 'bg-red-500'
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-body-xs text-text-muted">{v}%</span>
                  <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '120px' }}>
                    <div className={`w-full rounded-t absolute bottom-0 transition-all ${color}`} style={{ height: h }}/>
                  </div>
                  <span className="text-body-xs text-text-muted">{d.label}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-body-xs text-text-muted">
            <span>Target line: 85%</span>
            <button onClick={() => toast(`${TABS.find(t=>t.id===tab)?.label} trend data exported`, 'success')}
              className="text-forest-600 hover:underline">Download chart data</button>
          </div>
        </Card>
      </div>
    </div>
  )
}
