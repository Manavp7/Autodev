import React from 'react'
import { Download } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts'
import { useToast } from '../components/ui/Toast'

const oeeTrend = [
  { name: 'Day 1', val: 82 }, { name: 'Day 2', val: 84 }, { name: 'Day 3', val: 83 },
  { name: 'Day 4', val: 86 }, { name: 'Day 5', val: 85 }, { name: 'Day 6', val: 87.4 }
]

const paretoData = [
  { name: 'SC', vol: 450, cum: 45 },
  { name: 'DM', vol: 250, cum: 70 },
  { name: 'MS', vol: 150, cum: 85 },
  { name: 'PT', vol: 100, cum: 95 },
  { name: 'OT', vol: 50,  cum: 100 },
]

export function ReportsAnalyticsPage() {
  const toast = useToast()
  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-heading-xl">Reports & Analytics</h1>
          <p className="text-body text-text-secondary">Management reporting hub.</p>
        </div>
        <div className="flex gap-3">
          <div className="w-40"><Select options={[{label: 'Last 7 Days', value: '7d'}]} /></div>
          <div className="w-40"><Select options={[{label: 'All Plants', value: 'all'}]} /></div>
          <Button variant="secondary" iconLeft={<Download size={16}/>} onClick={() => toast('Report exporting to PDF...', 'success')}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 min-h-[400px]">
        {/* TOP LEFT: OEE Trend */}
        <Card className="p-5 flex flex-col">
          <h3 className="text-heading-sm mb-2">OEE Trend</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-display">87.4%</span>
            <span className="text-body-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">+1.2%</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oeeTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{fill: '#616161', fontSize: 12}} />
                <Area type="monotone" dataKey="val" stroke="#4CAF50" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* TOP RIGHT: Shift Summary */}
        <Card className="p-5 flex flex-col">
          <h3 className="text-heading-sm mb-4">Shift Production Summary</h3>
          <div className="flex gap-4 mb-6">
            <div>
              <div className="text-label text-text-muted uppercase">TARGET</div>
              <div className="font-bold">4,500 units</div>
            </div>
            <div>
              <div className="text-label text-text-muted uppercase">ACTUAL</div>
              <div className="font-bold">4,320 units</div>
            </div>
            <div>
              <div className="text-label text-text-muted uppercase">VARIANCE</div>
              <div className="font-bold text-red-600">-180 units</div>
            </div>
          </div>
          <div className="space-y-4">
            <ShiftBar label="Shift A" pct={95} color="bg-forest-600" />
            <ShiftBar label="Shift B" pct={88} color="bg-blue-600" />
            <ShiftBar label="Shift C" pct={92} color="bg-purple-800" />
          </div>
        </Card>

        {/* BOTTOM LEFT: Scrap Pareto */}
        <Card className="p-5 flex flex-col h-[350px]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-heading-sm">Scrap Pareto</h3>
            <span className="bg-red-50 text-red-700 border border-red-200 text-body-xs px-2 py-0.5 rounded font-medium">Top Defect: Surface Scratch</span>
          </div>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paretoData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#EF4444" tick={{fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Legend iconType="square" wrapperStyle={{fontSize: '12px'}} />
                <Bar yAxisId="left" dataKey="vol" name="Volume" fill="#3B82F6" maxBarSize={50} />
                {/* Simulated line using a second bar chart layer or standard recharts composed chart, keeping simple with Bar for now */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* BOTTOM RIGHT: Breakdown Freq */}
        <Card className="p-0 flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="text-heading-sm">Machine Breakdown Frequency</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-surface sticky top-0 border-b border-border text-label text-text-muted uppercase">
                <tr>
                  <th className="p-3">MACHINE ID</th>
                  <th className="p-3 text-right">EVENTS</th>
                  <th className="p-3 text-right">DOWNTIME (HRS)</th>
                  <th className="p-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="text-body-sm divide-y divide-border">
                <tr className="hover:bg-surface">
                  <td className="p-3 font-mono font-medium">CNC-04</td>
                  <td className="p-3 text-right font-bold text-red-600">14</td>
                  <td className="p-3 text-right font-bold text-red-600">22.5</td>
                  <td className="p-3 text-center"><span className="bg-red-600 text-white text-label px-2 py-0.5 rounded-sm">CRITICAL</span></td>
                </tr>
                <tr className="hover:bg-surface">
                  <td className="p-3 font-mono font-medium">PRS-12</td>
                  <td className="p-3 text-right">8</td>
                  <td className="p-3 text-right">12.0</td>
                  <td className="p-3 text-center"><span className="bg-gray-200 text-gray-700 text-label px-2 py-0.5 rounded-sm">MONITOR</span></td>
                </tr>
                <tr className="hover:bg-surface">
                  <td className="p-3 font-mono font-medium">CONV-A</td>
                  <td className="p-3 text-right">2</td>
                  <td className="p-3 text-right">1.5</td>
                  <td className="p-3 text-center"><span className="bg-green-100 text-green-800 border border-green-300 text-label px-2 py-0.5 rounded-sm">NOMINAL</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function ShiftBar({ label, pct, color }: { label: string, pct: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-body-sm mb-1 font-medium">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{width: `${pct}%`}} />
      </div>
    </div>
  )
}
