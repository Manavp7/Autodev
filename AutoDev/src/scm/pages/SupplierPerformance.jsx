import { useState } from 'react';
import { Download, Activity, TrendingUp, AlertCircle, Shield, Search, BarChart3, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, Modal, cn } from '../components/ui';
import { globalSuppliers } from '../data/mockData';
import { downloadCSV, downloadPDF } from '../utils/export';
import { useApp } from '../context/AppContext';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie
} from 'recharts';

export default function SupplierPerformance() {
  const { formatMoney, openDetail } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [capaModalOpen, setCAPAModalOpen] = useState(false);
  const [capaTarget, setCAPATarget] = useState(null);

  const scatterData = globalSuppliers.slice(0, 100).map(s => ({
    x: Number(s.otd),
    y: Number(s.iqc),
    z: s.spendYTD / 1000000,
    name: s.name,
    rating: s.rating
  }));

  const worstPerformers = [...globalSuppliers]
    .sort((a, b) => Number(a.score) - Number(b.score))
    .slice(0, 5)
    .map(s => ({ name: s.name, score: Number(s.score) }));

  const avgOtd = (globalSuppliers.reduce((acc, curr) => acc + Number(curr.otd), 0) / globalSuppliers.length).toFixed(1);
  const avgIqc = (globalSuppliers.reduce((acc, curr) => acc + Number(curr.iqc), 0) / globalSuppliers.length).toFixed(1);
  const avgPpap = (globalSuppliers.reduce((acc, curr) => acc + Number(curr.ppap), 0) / globalSuppliers.length).toFixed(1);
  const avgAudit = (globalSuppliers.reduce((acc, curr) => acc + Number(curr.auditScore), 0) / globalSuppliers.length).toFixed(1);
  const totalNCRs = globalSuppliers.reduce((acc, curr) => acc + curr.ncrCount, 0);

  const ratingDistribution = [
    { name: 'Gold', value: globalSuppliers.filter(s => s.rating === 'Gold').length, fill: '#F59E0B' },
    { name: 'Silver', value: globalSuppliers.filter(s => s.rating === 'Silver').length, fill: '#9CA3AF' },
    { name: 'Bronze', value: globalSuppliers.filter(s => s.rating === 'Bronze').length, fill: '#CD7F32' },
    { name: 'Critical', value: globalSuppliers.filter(s => s.rating === 'Critical').length, fill: '#EF4444' },
  ];

  const filteredSuppliers = [...globalSuppliers]
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => Number(a.score) - Number(b.score));

  const radarData = selectedSupplier ? [
    { metric: 'OTD', value: Number(selectedSupplier.otd), fullMark: 100 },
    { metric: 'IQC Pass', value: Number(selectedSupplier.iqc), fullMark: 100 },
    { metric: 'PPAP', value: Number(selectedSupplier.ppap), fullMark: 100 },
    { metric: 'Audit', value: Number(selectedSupplier.auditScore), fullMark: 100 },
    { metric: 'NCR Score', value: Math.max(0, 100 - selectedSupplier.ncrCount * 10), fullMark: 100 },
  ] : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border-dark p-3 rounded-lg shadow-lg">
          <p className="font-bold text-text-primary mb-1">{data.name}</p>
          <p className="text-sm text-text-secondary">OTD: <span className="text-text-primary">{data.x}%</span></p>
          <p className="text-sm text-text-secondary">IQC: <span className="text-text-primary">{data.y}%</span></p>
          <p className="text-sm text-text-secondary mt-1">
             Rating: <span className={data.rating === 'Gold' ? 'text-warning' : data.rating === 'Critical' ? 'text-danger' : 'text-success'}>{data.rating}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const handleRaiseCAPA = () => {
    if (capaTarget) {
      const idx = globalSuppliers.findIndex(s => s.id === capaTarget.id);
      if (idx !== -1) globalSuppliers[idx].riskRating = 'Under Review';
    }
    setCAPAModalOpen(false);
    setCAPATarget(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Supplier Performance Analytics</h1>
          <p className="text-text-secondary text-sm mt-1">Deep-dive into quality, delivery, risk and compliance metrics.</p>
        </div>
        <button 
          onClick={() => downloadCSV(filteredSuppliers, 'supplier_performance.csv')}
          className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm hover:border-accent flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* KPI Row — 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="glass-hover !p-4">
          <p className="text-xs text-text-secondary mb-1">Avg OTD</p>
          <p className="text-xl font-bold text-accent">{avgOtd}%</p>
        </Card>
        <Card className="glass-hover !p-4">
          <p className="text-xs text-text-secondary mb-1">Avg IQC Pass</p>
          <p className="text-xl font-bold text-success">{avgIqc}%</p>
        </Card>
        <Card className="glass-hover !p-4">
          <p className="text-xs text-text-secondary mb-1">Avg PPAP</p>
          <p className="text-xl font-bold text-purple-400">{avgPpap}%</p>
        </Card>
        <Card className="glass-hover !p-4">
          <p className="text-xs text-text-secondary mb-1">Avg Audit Score</p>
          <p className="text-xl font-bold text-cyan-400">{avgAudit}</p>
        </Card>
        <Card className="glass-hover !p-4">
          <p className="text-xs text-text-secondary mb-1">Total NCRs</p>
          <p className="text-xl font-bold text-danger">{totalNCRs}</p>
        </Card>
        <Card className="glass-hover !p-4">
          <p className="text-xs text-text-secondary mb-1">Critical Suppliers</p>
          <p className="text-xl font-bold text-danger">{ratingDistribution.find(r => r.name === 'Critical')?.value || 0}</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Scatter */}
        <Card className="glass-hover lg:col-span-1">
          <CardHeader><CardTitle>OTD vs IQC Matrix</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                <XAxis type="number" dataKey="x" name="OTD" unit="%" stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 11}} domain={[60, 100]} />
                <YAxis type="number" dataKey="y" name="IQC" unit="%" stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 11}} domain={[70, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="Suppliers" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rating === 'Critical' ? '#EF4444' : entry.rating === 'Gold' ? '#F59E0B' : '#2563EB'} fillOpacity={0.6} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Non-Performers */}
        <Card className="glass-hover lg:col-span-1">
          <CardHeader><CardTitle>Bottom 5 Performers</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={worstPerformers} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" horizontal={false} />
                <XAxis type="number" stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 11}} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={110} stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1E2D45', color: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Rating Distribution Pie + Radar */}
        <Card className="glass-hover lg:col-span-1">
          <CardHeader><CardTitle>Rating Distribution</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ratingDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                  {ratingDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1E2D45', color: '#fff', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Full Scorecard Table */}
      <Card className="!p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" placeholder="Search supplier by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary border border-border-dark rounded-md pl-10 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all"
          />
        </div>
      </Card>

      {/* Full Scorecard Table */}
      <Card className="overflow-hidden flex flex-col p-0 border-t-2 border-t-accent">
        <div className="p-4 border-b border-border-dark flex justify-between items-center bg-primary">
          <h3 className="font-semibold text-text-primary">Full Scorecard Detail ({filteredSuppliers.length} suppliers)</h3>
          <div className="text-sm text-text-secondary">Sorted by lowest score</div>
        </div>
        <div className="overflow-auto max-h-[500px] custom-scrollbar">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-text-secondary uppercase bg-surface sticky top-0 z-10 border-b border-border-dark shadow-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium text-center">Score</th>
                <th className="px-4 py-3 font-medium text-center">OTD %</th>
                <th className="px-4 py-3 font-medium text-center">IQC %</th>
                <th className="px-4 py-3 font-medium text-center">PPAP %</th>
                <th className="px-4 py-3 font-medium text-center">Audit</th>
                <th className="px-4 py-3 font-medium text-center">NCRs</th>
                <th className="px-4 py-3 font-medium text-center">Risk</th>
                <th className="px-4 py-3 font-medium text-center">Rating</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.slice(0, 500).map((s) => (
                <tr 
                  key={s.id} 
                  className={cn(
                    "border-b border-border-dark hover:bg-accent/5 transition-all cursor-pointer group",
                    selectedSupplier?.id === s.id && "bg-accent/10"
                  )}
                  onClick={() => openDetail('SUPPLIER', s.name)}
                >
                  <td className="px-4 py-4">
                    <div className="font-bold text-text-primary group-hover:text-accent transition-colors">{s.name}</div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-tight mt-0.5">{s.id} · {s.tier}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border-dark font-black text-text-primary tabular-nums shadow-inner">
                      {s.score}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={cn("font-bold tabular-nums", Number(s.otd) < 80 ? 'text-danger' : 'text-success')}>{s.otd}%</div>
                    <div className="text-[9px] text-text-secondary uppercase">OTD</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={cn("font-bold tabular-nums", Number(s.iqc) < 85 ? 'text-danger' : 'text-success')}>{s.iqc}%</div>
                    <div className="text-[9px] text-text-secondary uppercase">IQC</div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-text-primary tabular-nums">{s.ppap}%</td>
                  <td className="px-4 py-4 text-center font-bold text-text-primary tabular-nums">{s.auditScore}</td>
                  <td className="px-4 py-4 text-center font-bold text-text-secondary tabular-nums">{s.ncrCount}</td>
                  <td className="px-4 py-4 text-center">
                    <Badge variant={s.riskRating === 'High' ? 'danger' : s.riskRating === 'Medium' ? 'warning' : 'success'}>{s.riskRating}</Badge>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge variant={s.rating === 'Gold' ? 'success' : s.rating === 'Critical' ? 'danger' : s.rating === 'Silver' ? 'default' : 'warning'}>
                      {s.rating}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {s.rating === 'Critical' && (
                        <button 
                          onClick={() => { setCAPATarget(s); setCAPAModalOpen(true); }}
                          className="px-2 py-1 bg-danger/10 text-danger border border-danger/20 rounded text-[10px] font-bold uppercase hover:bg-danger/20 transition-all"
                        >Raise CAPA</button>
                      )}
                      <button 
                        onClick={() => openDetail('SUPPLIER', s.name)}
                        className="p-1.5 bg-surface border border-border-dark rounded-md text-text-secondary hover:text-accent hover:border-accent transition-all"
                        title="View Profile"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CAPA Modal */}
      <Modal isOpen={capaModalOpen} onClose={() => setCAPAModalOpen(false)} title="Raise CAPA (Corrective Action)">
        <div className="space-y-4">
          {capaTarget && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm">
              <span className="text-text-secondary">Supplier: </span>
              <span className="font-bold text-danger">{capaTarget.name} ({capaTarget.id})</span>
              <div className="mt-1 text-text-secondary text-xs">Score: {capaTarget.score} | OTD: {capaTarget.otd}% | NCRs: {capaTarget.ncrCount}</div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">CAPA Type</label>
            <select className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none">
              <option>Quality Non-Conformance</option><option>Delivery Failure</option><option>Documentation Issue</option><option>Process Deviation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Root Cause Description</label>
            <textarea className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" rows={3} placeholder="Describe the root cause..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Corrective Action Required By</label>
            <input type="date" className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setCAPAModalOpen(false)} className="px-4 py-2 bg-primary border border-border-dark text-text-secondary rounded hover:text-text-primary transition-colors text-sm">Cancel</button>
            <button onClick={handleRaiseCAPA} className="px-4 py-2 bg-danger text-white rounded hover:bg-danger/90 transition-colors text-sm">Submit CAPA</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
