import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Package, Activity, IndianRupee, ShieldCheck, AlertTriangle, Clock, Download, Eye, LayoutDashboard,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, MapPin, Target, Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, Modal, cn } from '../components/ui';
import { dashboardKpis, monthlyPOVolume, globalShortages, globalSuppliers, globalPOs, globalPRs, formatCurrency } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { downloadCSV } from '../utils/export';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, Legend,
  ComposedChart, Scatter, ScatterChart, ZAxis, Treemap, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const spendByCategory = [
  { name: 'Engine Components', value: 8.2 },
  { name: 'Body Parts', value: 5.1 },
  { name: 'Raw Materials', value: 4.5 },
  { name: 'Electrical', value: 3.8 },
  { name: 'Fasteners', value: 1.2 },
];

const supplierRiskData = [
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'High', value: 24, color: '#f59e0b' },
  { name: 'Medium', value: 45, color: '#3b82f6' },
  { name: 'Low', value: 87, color: '#10b981' },
];

const inventoryHealth = [
  { month: 'Jan', stock: 450, safety: 300, shortages: 12 },
  { month: 'Feb', stock: 420, safety: 300, shortages: 18 },
  { month: 'Mar', stock: 480, safety: 300, shortages: 8 },
  { month: 'Apr', stock: 510, safety: 300, shortages: 5 },
  { month: 'May', stock: 390, safety: 300, shortages: 25 },
  { month: 'Jun', stock: 460, safety: 300, shortages: 10 },
];

const supplierPerformanceRadar = [
  { subject: 'OTD', A: 85, fullMark: 100 },
  { subject: 'Quality', A: 92, fullMark: 100 },
  { subject: 'Cost', A: 78, fullMark: 100 },
  { subject: 'Lead Time', A: 88, fullMark: 100 },
  { subject: 'Flexibility', A: 70, fullMark: 100 },
];

const procurementThroughput = [
  { name: 'PR Received', value: 840, fill: '#3b82f6' },
  { name: 'RFQ Issued', value: 720, fill: '#60a5fa' },
  { name: 'PO Created', value: 610, fill: '#93c5fd' },
  { name: 'GRN Received', value: 580, fill: '#bfdbfe' },
];

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export default function Dashboard() {
  const { formatMoney, openDetail } = useApp();
  const [actionPlanOpen, setActionPlanOpen] = useState(false);

  const topSuppliers = globalSuppliers
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 15);

  const chartTooltipStyle = { backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', padding: '12px' };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-text-secondary mt-1">Real-time supply chain overview & performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => downloadCSV(dashboardKpis, 'dashboard_metrics.csv')} className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm font-medium hover:border-accent transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4 text-accent" /> Export Report
          </button>
          <button onClick={() => setActionPlanOpen(true)} className="px-4 py-2 bg-accent text-white rounded-md text-sm font-bold hover:bg-accent/90 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)] flex items-center gap-2">
            <Zap className="w-4 h-4" /> Mitigation Center
          </button>
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Active POs" value={dashboardKpis.totalActivePOs} trend={dashboardKpis.poTrend} icon={Package} color="text-accent" />
        <KpiCard title="Supplier OTD" value={`${dashboardKpis.supplierOTD}%`} trend={dashboardKpis.otdTrend} icon={Activity} color="text-success" reverseTrend />
        <KpiCard title="Critical Parts" value={dashboardKpis.openShortages.critical} subtext={`/ ${dashboardKpis.openShortages.total}`} trend={-5} icon={AlertTriangle} color="text-danger" reverseTrend />
        <KpiCard title="PO Cycle" value={`${dashboardKpis.poCycleTime}d`} trend={dashboardKpis.cycleTimeTrend} icon={Clock} color="text-warning" reverseTrend />
        <KpiCard title="Cost Savings" value={formatMoney(12400000)} trend={dashboardKpis.savingsTrend} icon={IndianRupee} color="text-purple-500" />
        <KpiCard title="Audit Health" value={`92%`} trend={2.4} icon={ShieldCheck} color="text-accent" />
      </div>

      {/* Primary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PO Volume Trend */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col h-[400px] group">
          <CardHeader className="flex flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-accent" />
              <CardTitle>Procurement Throughput & Trend</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="success">Up 12.4%</Badge>
              <Badge variant="outline">CY 2024</Badge>
            </div>
          </CardHeader>
          <div className="flex-1 w-full px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyPOVolume} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={chartTooltipStyle} />
                <Legend verticalAlign="top" align="right" height={36}/>
                <Area type="monotone" dataKey="volume" name="PO Count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPo)" />
                <Bar dataKey="volume" name="Throughput" fill="#2563eb" opacity={0.1} barSize={20} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-accent" />
              <CardTitle>Spend by Category</CardTitle>
            </div>
          </CardHeader>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={spendByCategory} 
                  cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" animationDuration={1500}
                  label={({ name, value }) => `${value}Cr`}
                >
                  {spendByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={chartTooltipStyle} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Secondary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Health */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="flex flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              <CardTitle>Inventory Health vs. Shortages</CardTitle>
            </div>
            <Badge variant="warning">Action Required</Badge>
          </CardHeader>
          <div className="flex-1 w-full px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={inventoryHealth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={chartTooltipStyle} />
                <Bar yAxisId="left" dataKey="stock" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} name="On-Hand Stock" />
                <Line yAxisId="left" type="monotone" dataKey="safety" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Safety Stock" />
                <Area yAxisId="right" type="monotone" dataKey="shortages" fill="#ef4444" stroke="#ef4444" fillOpacity={0.1} name="Critical Shortages" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Profile */}
        <Card className="overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              <CardTitle>Supplier Risk Profile</CardTitle>
            </div>
          </CardHeader>
          <div className="flex-1 w-full flex flex-col justify-center px-6">
            <div className="space-y-6">
              {supplierRiskData.map((risk, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-text-secondary">{risk.name} Risk</span>
                    <span className="text-text-primary">{risk.value} Vendors</span>
                  </div>
                  <div className="h-2 bg-primary border border-border-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${(risk.value / 168) * 100}%`, backgroundColor: risk.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border-dark">
              <p className="text-[10px] text-text-secondary text-center uppercase font-bold tracking-widest leading-relaxed">
                Risk calculation based on <br/> OTD, Quality (IQC), and Financial Stability.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Third Analytics Row - Advanced Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Performance */}
        <Card className="overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              <CardTitle>Supply Chain Resilience Radar</CardTitle>
            </div>
          </CardHeader>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={supplierPerformanceRadar}>
                <PolarGrid stroke="#1E2D45" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1E2D45" />
                <Radar name="Performance" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Funnel Efficiency */}
        <Card className="overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              <CardTitle>Procurement Lifecycle Efficiency</CardTitle>
            </div>
          </CardHeader>
          <div className="flex-1 w-full px-6 flex flex-col justify-center space-y-4">
            {procurementThroughput.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-secondary">
                  <span>{item.name}</span>
                  <span>{item.value} Units</span>
                </div>
                <div className="h-6 bg-primary/30 border border-border-dark/50 rounded-lg overflow-hidden relative group">
                  <div className="h-full transition-all duration-1000 group-hover:brightness-125" style={{ width: `${(item.value / 840) * 100}%`, backgroundColor: item.fill }} />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white mix-blend-difference">
                    {((item.value / 840) * 100).toFixed(1)}% Conversion
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Distribution (Mocked Heatmap Concept) */}
        <Card className="overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-danger" />
              <CardTitle>Regional Supply Risk Heatmap</CardTitle>
            </div>
          </CardHeader>
          <div className="flex-1 p-6 relative">
            <div className="grid grid-cols-2 gap-4 h-full">
              {[
                { region: 'North Zone', risk: 'Low', color: 'bg-success/20 text-success border-success/30', val: 92 },
                { region: 'South Zone', risk: 'High', color: 'bg-danger/20 text-danger border-danger/30', val: 45 },
                { region: 'West Zone', risk: 'Medium', color: 'bg-warning/20 text-warning border-warning/30', val: 78 },
                { region: 'East Zone', risk: 'Low', color: 'bg-success/20 text-success border-success/30', val: 88 },
              ].map((r, i) => (
                <div key={i} className={cn("p-4 rounded-2xl border flex flex-col justify-between items-center text-center group hover:scale-105 transition-all cursor-pointer", r.color)}>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{r.region}</p>
                  <p className="text-2xl font-black">{r.val}%</p>
                  <p className="text-[9px] font-bold uppercase">Stability Index</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <Card className="glass-hover overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row justify-between items-center mb-4 border-b border-border-dark pb-4">
            <CardTitle>Strategic Partners (High Spend)</CardTitle>
            <button className="text-xs text-accent hover:underline font-bold" onClick={() => window.location.hash = '/suppliers'}>View Directory</button>
          </CardHeader>
          <div className="space-y-3 p-4">
            {topSuppliers.map((supplier, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-primary/20 border border-border-dark group hover:border-accent transition-all cursor-pointer shadow-sm" onClick={() => openDetail('SUPPLIER', supplier.name)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border-dark flex items-center justify-center font-black text-lg text-accent shadow-inner group-hover:scale-110 transition-transform">
                    {supplier.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-text-primary group-hover:text-accent transition-colors">{supplier.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" className="text-[9px] px-1.5 py-0">{supplier.category}</Badge>
                      <span className="text-[10px] text-text-secondary font-medium">Tier 1 Partner</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-text-primary tabular-nums tracking-tight">{supplier.spend} Cr</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Zap className="w-3 h-3 text-success fill-success" />
                    <span className="text-[10px] text-success font-black">{supplier.performance}% OTD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Shortage Alerts */}
        <Card className="glass-hover overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row justify-between items-center mb-4 border-b border-border-dark pb-4">
            <CardTitle>Critical Shortage Log</CardTitle>
            <button className="text-xs text-accent hover:underline font-bold" onClick={() => window.location.hash = '/shortages'}>Active Alerts</button>
          </CardHeader>
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-secondary uppercase bg-primary sticky top-0 z-10 border-b border-border-dark">
                <tr>
                  <th className="px-6 py-4 font-bold">Part ID</th>
                  <th className="px-6 py-4 font-bold">Supplier</th>
                  <th className="px-6 py-4 font-bold">Gap</th>
                  <th className="px-6 py-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {globalShortages.filter(s => s.severity === 'Critical').slice(0, 18).map((shortage, i) => (
                  <tr key={i} className="border-b border-border-dark hover:bg-primary/50 transition-colors group cursor-pointer" onClick={() => openDetail('PART', shortage.partNumber)}>
                    <td className="px-6 py-4 font-bold text-accent group-hover:underline">{shortage.partNumber}</td>
                    <td className="px-6 py-4 truncate max-w-[180px] text-text-primary font-bold group-hover:text-accent" onClick={(e) => { e.stopPropagation(); openDetail('SUPPLIER', shortage.supplier); }}>{shortage.supplier}</td>
                    <td className="px-6 py-4 text-danger font-black tabular-nums">{shortage.requiredQty}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant="danger" className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]">Critical</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal isOpen={actionPlanOpen} onClose={() => setActionPlanOpen(false)} title="Mitigation Control Tower — Active Protocols">
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="p-5 bg-danger/10 border border-danger/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-danger rounded-lg text-white"><AlertTriangle className="w-5 h-5" /></div>
              <h4 className="text-lg font-black text-danger uppercase tracking-tight">Phase 1: Line Stop Mitigation</h4>
            </div>
            <ul className="space-y-3 text-sm text-text-primary font-medium">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-danger/20 text-danger flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>Air-freight approval for {dashboardKpis.openShortages.critical} critical line-stop components.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-danger/20 text-danger flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>Redirecting 4 in-transit shipments to Gurgaon Plant via premium logistics.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-danger/20 text-danger flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>Urgent IQC disposition for 12 pending GRNs at gate entry.</span>
              </li>
            </ul>
          </div>
          <div className="p-5 bg-warning/10 border border-warning/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-warning rounded-lg text-white"><Clock className="w-5 h-5" /></div>
              <h4 className="text-lg font-black text-warning uppercase tracking-tight">Phase 2: Tactical Balancing</h4>
            </div>
            <ul className="space-y-3 text-sm text-text-primary font-medium">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-warning/20 text-warning flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
                <span>Review {globalPRs.filter(p => p.status === 'Pending Approval').length} PRs awaiting manager approval.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-warning/20 text-warning flex items-center justify-center text-[10px] shrink-0 mt-0.5">5</span>
                <span>Contract renewal initiation for 4 vendors expiring in 30 days.</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-end pt-4 border-t border-border-dark">
            <button onClick={() => setActionPlanOpen(false)} className="px-10 py-3 bg-accent text-white rounded-xl font-bold shadow-xl hover:bg-accent/90 transition-all active:scale-95">Acknowledge & Sync</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function KpiCard({ title, value, subtext, trend, icon: Icon, color, reverseTrend }) {
  const isPositive = trend > 0;
  const isGood = reverseTrend ? !isPositive : isPositive;
  
  return (
    <Card className="glass-hover relative overflow-hidden group !p-5 transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">{title}</p>
          <h4 className="text-2xl font-black text-text-primary mt-2 flex items-baseline gap-2 tabular-nums tracking-tighter">
            {value}
            {subtext && <span className="text-[10px] font-bold text-text-secondary lowercase">{subtext}</span>}
          </h4>
        </div>
        <div className={`p-3 rounded-2xl bg-surface border border-border-dark shadow-inner ${color} shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 relative z-10">
        <span className={`flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black border ${isGood ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(trend)}%
        </span>
        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tight opacity-50">vs last qtr</span>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-full translate-x-12 translate-y-12 group-hover:scale-150 transition-transform"></div>
    </Card>
  );
}
