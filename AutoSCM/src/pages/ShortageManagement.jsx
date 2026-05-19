import { useState } from 'react';
import { AlertTriangle, Download, Search, ArrowUpRight, CheckCircle2, Clock, AlertCircle, Eye, Zap, ShieldAlert, BarChart3, Truck } from 'lucide-react';
import { Card, Badge, Modal } from '../components/ui';
import { globalShortages, globalPRs } from '../data/mockData';
import { downloadCSV } from '../utils/export';
import { useApp } from '../context/AppContext';
import { cn } from '../components/ui';

export default function ShortageManagement() {
  const { openDetail, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [shortages, setShortages] = useState(globalShortages);
  const [selectedShortageId, setSelectedShortageId] = useState(null);
  const [expediteAction, setExpediteAction] = useState('Air Freight');
  const [expediteJustification, setExpediteJustification] = useState('');
  const [isActionPlanOpen, setIsActionPlanOpen] = useState(false);

  const handleExpedite = () => {
    if (!selectedShortageId) return;
    const idx = shortages.findIndex(s => s.id === selectedShortageId);
    if (idx !== -1) {
      const updated = [...shortages];
      updated[idx].status = 'Expedited';
      updated[idx].severity = updated[idx].severity === 'Critical' ? 'High' : 'Normal';
      setShortages(updated);
    }
    setIsModalOpen(false);
    setSelectedShortageId(null);
    setExpediteJustification('');
  };
  
  const filteredShortages = shortages.filter(s => 
    s.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Critical', value: shortages.filter(s => s.severity === 'Critical').length, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/5' },
    { label: 'High Risk', value: shortages.filter(s => s.severity === 'High').length, icon: Clock, color: 'text-warning', bg: 'bg-warning/5' },
    { label: 'Stable', value: shortages.filter(s => s.severity === 'Normal').length, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5' },
    { label: 'Expedited', value: shortages.filter(s => s.status === 'Expedited').length, icon: Zap, color: 'text-accent', bg: 'bg-accent/5' },
  ];

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-6rem)] overflow-hidden">
      {/* Alert Banner */}
      {shortages.some(s => s.severity === 'Critical') && (
        <div className="bg-danger/10 border border-danger/20 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 shrink-0 shadow-lg shadow-danger/5 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-danger rounded-xl text-white shadow-lg shadow-danger/20"><ShieldAlert className="w-6 h-6 animate-pulse" /></div>
            <div>
              <h3 className="text-danger font-black text-base tracking-tight leading-none mb-1 uppercase">Supply Chain Disruption Alert</h3>
              <p className="text-danger/80 text-[10px] font-black uppercase tracking-widest">Active line-stop risks detected in primary production clusters</p>
            </div>
          </div>
          <button onClick={() => setIsActionPlanOpen(true)} className="px-6 py-2 bg-danger text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-danger/90 transition-all shadow-xl shadow-danger/20 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Open Mitigation Command
          </button>
        </div>
      )}

      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row gap-4 shrink-0">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className={cn("p-4 border border-border-dark/50 rounded-2xl flex items-center gap-4 shadow-sm bg-surface/50 backdrop-blur-sm", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
              <div>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-2xl font-black text-text-primary leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-sm p-2 rounded-2xl border border-border-dark/50">
          <div className="relative min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" placeholder="Search Intel (Part, Supplier, Desc)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-primary border border-border-dark/50 rounded-xl pl-11 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:border-accent outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => downloadCSV(filteredShortages, 'shortage_intel.csv')}
            className="p-3 bg-primary border border-border-dark/50 rounded-xl text-text-secondary hover:text-accent hover:border-accent transition-all group"
            title="Export Intelligence"
          >
            <Download className="w-5 h-5 group-hover:scale-110" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <Card className="flex-1 overflow-hidden flex flex-col p-0 border border-border-dark/50 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-danger via-warning to-success z-30" />
        <div className="overflow-auto flex-1 custom-scrollbar scroll-smooth">
          <table className="w-full text-sm text-left relative border-separate border-spacing-0">
            <thead className="sticky top-0 z-20">
              <tr className="bg-surface/95 backdrop-blur-md">
                {['Part No & Description', 'Supplier Intel', 'Inventory Status', 'Risk Severity', 'Lifecycle', 'Actions'].map((h, i) => (
                  <th key={h} className={cn(
                    "px-6 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest border-b border-border-dark/50",
                    i === 4 ? "text-center" : i === 5 ? "text-right" : ""
                  )}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/30">
              {filteredShortages.map((shortage) => (
                <tr key={shortage.id} className="hover:bg-primary/40 transition-all group duration-200">
                  <td className="px-6 py-5 max-w-[240px]">
                    <div onClick={() => openDetail('PART', shortage.partNumber)} className="font-black text-accent hover:text-accent/80 cursor-pointer transition-colors tracking-tighter text-sm uppercase">{shortage.partNumber}</div>
                    <div className="text-[10px] text-text-secondary mt-1.5 font-bold uppercase truncate opacity-70">{shortage.description}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div onClick={() => openDetail('SUPPLIER', shortage.supplier)} className="text-text-primary font-black text-xs hover:text-accent cursor-pointer transition-all uppercase tracking-tight flex items-center gap-1.5 group/sup">
                      {shortage.supplier}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/sup:opacity-100 -translate-y-1 translate-x-1 transition-all" />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className={cn("text-sm font-black tabular-nums leading-none", shortage.availableStock === 0 ? 'text-danger' : 'text-text-primary')}>{shortage.availableStock}</span>
                        <div className="h-1.5 w-24 bg-primary rounded-full overflow-hidden flex-1">
                          <div className={cn("h-full rounded-full transition-all duration-1000", shortage.availableStock === 0 ? "w-0 bg-danger" : "bg-accent")} style={{ width: `${Math.min(100, (shortage.availableStock/shortage.requiredQty) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-text-secondary uppercase">/ {shortage.requiredQty}</span>
                      </div>
                      <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tighter opacity-50">Units Required Immediately</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant={shortage.severity === 'Critical' ? 'danger' : shortage.severity === 'High' ? 'warning' : 'default'} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-white/5">
                      {shortage.severity}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge variant={shortage.status === 'Expedited' ? 'accent' : 'outline'} className="text-[9px] font-black uppercase tracking-widest px-3 py-1">
                      {shortage.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      {shortage.status !== 'Expedited' && (
                        <button 
                          onClick={() => {
                            const pr = {
                              id: `PR-2024-${Math.floor(Math.random() * 9000) + 1000}`,
                              date: new Date().toISOString().split('T')[0],
                              requestor: user?.name || "System",
                              department: 'Production',
                              partNumber: shortage.partNumber,
                              description: shortage.description,
                              qty: shortage.requiredQty,
                              uom: "Nos",
                              requiredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                              estCost: shortage.requiredQty * 5000,
                              status: "Pending Approval",
                              urgency: "Critical",
                            };
                            globalPRs.unshift(pr);
                            const idx = shortages.findIndex(s => s.id === shortage.id);
                            if (idx !== -1) {
                              const updated = [...shortages];
                              updated[idx].status = 'Expedited';
                              setShortages(updated);
                            }
                          }}
                          className="px-4 py-1.5 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-95"
                        >
                          Trigger PR
                        </button>
                      )}
                      <button onClick={() => { setSelectedShortageId(shortage.id); setIsModalOpen(true); }} className="px-4 py-1.5 bg-surface border border-border-dark/50 rounded-xl text-[10px] font-black text-text-secondary uppercase tracking-widest hover:text-accent hover:border-accent transition-all">Expedite</button>
                      <button onClick={() => openDetail('PART', shortage.partNumber)} className="p-2 bg-surface border border-border-dark/50 rounded-xl text-text-secondary hover:text-accent transition-all group-hover:scale-110">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Expedite Action Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Intelligence Command: Expedite Action">
        <div className="space-y-5 p-2">
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-4">
            <Truck className="w-8 h-8 text-accent" />
            <div>
              <p className="text-[10px] font-black text-text-secondary uppercase">Selected Part</p>
              <p className="text-sm font-black text-text-primary">{shortages.find(s => s.id === selectedShortageId)?.partNumber}</p>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">Tactical Protocol</label>
            <div className="grid grid-cols-2 gap-2">
              {['Air Freight', 'Direct Logistics', 'Buffer Pull', 'Dual Sourcing'].map(opt => (
                <button key={opt} onClick={() => setExpediteAction(opt)} className={cn("py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all border", expediteAction === opt ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" : "bg-primary border-border-dark text-text-secondary hover:border-accent")}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">Mission Justification</label>
            <textarea value={expediteJustification} onChange={(e) => setExpediteJustification(e.target.value)} className="w-full bg-primary border border-border-dark rounded-2xl px-4 py-3 text-xs text-text-primary focus:border-accent outline-none resize-none h-24 placeholder:opacity-30" placeholder="Provide strategic rationale for this action..."></textarea>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-text-secondary font-black text-[10px] uppercase tracking-widest hover:text-text-primary transition-colors">Abort Mission</button>
            <button onClick={handleExpedite} className="flex-[2] py-3.5 bg-accent text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all active:scale-95">Confirm Execution</button>
          </div>
        </div>
      </Modal>

      {/* Action Plan Modal - Detailed Version */}
      <Modal isOpen={isActionPlanOpen} onClose={() => setIsActionPlanOpen(false)} title="Global Supply Mitigation Roadmap (Q2-2024)">
        <div className="space-y-6 max-h-[70vh] overflow-auto custom-scrollbar pr-2">
          <div className="p-5 bg-danger/10 border border-danger/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldAlert className="w-24 h-24 text-danger" /></div>
            <h4 className="text-lg font-black text-danger uppercase tracking-tight flex items-center gap-2 mb-3"><AlertCircle className="w-6 h-6" /> Strategic Assessment</h4>
            <p className="text-sm text-text-primary font-bold leading-relaxed">
              Line-stop risk confirmed for {shortages.filter(s => s.severity === 'Critical').length} critical nodes. 
              The following command protocols are authorized for immediate implementation across the supply chain cluster.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="p-4 border border-border-dark/50 rounded-2xl bg-surface/50 text-center">
               <p className="text-[9px] font-black text-text-secondary uppercase mb-1">Risk Capital</p>
               <p className="text-xl font-black text-danger">$1.42M</p>
             </div>
             <div className="p-4 border border-border-dark/50 rounded-2xl bg-surface/50 text-center">
               <p className="text-[9px] font-black text-text-secondary uppercase mb-1">Time to Stop</p>
               <p className="text-xl font-black text-warning">8.5 Hours</p>
             </div>
             <div className="p-4 border border-border-dark/50 rounded-2xl bg-surface/50 text-center">
               <p className="text-[9px] font-black text-text-secondary uppercase mb-1">Affected Units</p>
               <p className="text-xl font-black text-text-primary">480 Nos</p>
             </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-accent uppercase tracking-widest px-1">Phase-Wise Mitigation Protocol</h5>
            {[
              { phase: '01: IMMEDIATE RESPONSE', task: 'Activate premium air-logistics for Cluster A components. Redirect safety buffer from Region 4.', status: 'Active' },
              { phase: '02: SUPPLIER SYNC', task: 'Shift production priorities at Tier-1 vendors. Authorize overtime (Shift 3) for pending batches.', status: 'In Progress' },
              { phase: '03: LONG-TERM CURE', task: 'Onboard Alternative Supplier (Project Delta) by EOM. Revise safety stock algorithm (+15%).', status: 'Planned' }
            ].map((p, i) => (
              <div key={i} className="flex gap-4 p-4 bg-primary/20 rounded-2xl border border-border-dark/50 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/30 group-hover:bg-accent transition-all" />
                <div className="shrink-0 w-10 h-10 rounded-full bg-surface border border-border-dark/50 flex items-center justify-center font-black text-accent text-xs">P{i+1}</div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black text-text-primary tracking-widest">{p.phase}</p>
                    <Badge variant={p.status === 'Active' ? 'danger' : 'default'} className="text-[8px]">{p.status}</Badge>
                  </div>
                  <p className="text-[11px] text-text-secondary font-medium leading-relaxed">{p.task}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border border-border-dark/50 rounded-2xl bg-accent/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-accent" />
              <div>
                <p className="text-xs font-black text-text-primary leading-none mb-1 uppercase tracking-tighter">Projected Recovery Rate</p>
                <p className="text-[10px] font-bold text-text-secondary">ESTIMATED RE-STABILIZATION BY 24-MAY-2024</p>
              </div>
            </div>
            <p className="text-2xl font-black text-accent">92.4%</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsActionPlanOpen(false)} className="flex-1 py-4 bg-primary border border-border-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-text-primary">Close Roadmap</button>
            <button onClick={() => setIsActionPlanOpen(false)} className="flex-[2] py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all">Acknowledge & Deploy Protocol</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
