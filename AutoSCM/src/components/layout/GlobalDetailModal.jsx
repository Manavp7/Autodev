import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Clock, Truck, Shield, DollarSign, BarChart2, MessageSquare, Mail, ShieldCheck, CreditCard, Activity, Command } from 'lucide-react';
import { Card, Badge, cn } from '../ui';
import { useApp } from '../../context/AppContext';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { downloadCSV, downloadPDF } from '../../utils/export';

export default function GlobalDetailModal() {
  const { detailView, closeDetail, records, approveRequest, rejectRequest, user, formatMoney } = useApp();
  const { type, id, isOpen } = detailView;
  const [activeTab, setActiveTab] = useState('Overview');
  const [approvalComment, setApprovalComment] = useState('');

  if (!type || !id) return null;

  let data = null;
  const key = type.toLowerCase() + 's';
  if (records[key]) {
    data = records[key].find(r => r.id === id);
  } else if (type === 'SUPPLIER') {
    data = records.pos.find(po => po.supplier === id)?.supplierData || { name: id, otd: 94, iqc: 98, status: 'Active' };
  } else if (type === 'PART') {
    data = records.pos.find(p => p.partNumber === id) || records.prs.find(p => p.partNumber === id);
    if (data) data = { ...data, name: data.partDescription || data.description, inventory: { stock: 1240, safety: 500, leadTime: '14 Days' }, specs: { material: 'Steel', weight: '0.5kg' } };
  }

  if (!data) return null;

  const performanceData = [
    { month: 'Jan', value: 85 }, { month: 'Feb', value: 88 }, { month: 'Mar', value: 92 },
    { month: 'Apr', value: 90 }, { month: 'May', value: 95 }, { month: 'Jun', value: 93 },
  ];

  const renderWorkflow = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-primary/20 border border-border-dark rounded-2xl p-5">
        <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Current Approval Status</h4>
        <div className="flex items-center gap-4 mb-6">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
            data.status === 'Approved' || data.status === 'Closed' ? "bg-success/20 text-success" : 
            data.status === 'Rejected' ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning animate-pulse"
          )}>
            {data.status === 'Approved' || data.status === 'Closed' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-lg font-black text-text-primary">{data.status || 'Pending Review'}</p>
            <p className="text-xs text-text-secondary font-medium">Next Step: {data.status === 'Approved' ? 'Process Complete' : 'Review Required'}</p>
          </div>
        </div>

        {['PR', 'PO'].includes(type) && !['Approved', 'Rejected', 'Closed'].includes(data.status) && (
          <div className="space-y-4 pt-4 border-t border-border-dark">
            <textarea 
              value={approvalComment} 
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder="Add internal note..."
              className="w-full bg-primary border border-border-dark rounded-xl p-3 text-xs text-text-primary focus:border-accent outline-none h-20 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={() => { approveRequest(type, id, approvalComment); setApprovalComment(''); }} className="flex-1 py-2.5 bg-success text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-success/90 transition-all">Approve</button>
              <button onClick={() => { rejectRequest(type, id, approvalComment); setApprovalComment(''); }} className="flex-1 py-2.5 bg-danger text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-danger/90 transition-all">Reject</button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Approval History</h4>
        <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-dark">
          {(data.approvalHistory || [
            { date: '2024-05-01T10:00:00Z', user: 'System', role: 'AUTOMATION', action: 'Created', comment: 'Draft generated' },
          ]).map((h, i) => (
            <div key={i} className="flex gap-4 relative pl-8">
              <div className="absolute left-[14px] top-1.5 w-2 h-2 rounded-full bg-accent ring-4 ring-primary" />
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-black text-text-primary">{h.action}</p>
                  <p className="text-[9px] text-text-secondary">{new Date(h.date).toLocaleDateString()}</p>
                </div>
                <p className="text-[10px] text-text-secondary">By <span className="text-accent font-bold">{h.user}</span></p>
                {h.comment && <p className="mt-1 text-[10px] bg-primary/30 p-2 rounded-lg italic">"{h.comment}"</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={closeDetail} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[520px] bg-surface border-l border-border-dark shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border-dark flex justify-between items-start bg-primary/10 shrink-0">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-full">{type} INTELLIGENCE</span>
              <Badge variant={data.status === 'Approved' || data.status === 'Closed' ? 'success' : 'warning'} className="text-[8px] font-black uppercase">{data.status || 'Active'}</Badge>
            </div>
            <h2 className="text-2xl font-black text-text-primary tracking-tighter">{data.name || data.id}</h2>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-xs font-bold text-text-secondary flex items-center gap-1.5"><Command className="w-3.5 h-3.5 text-accent" /> <span className="font-mono text-accent">{id}</span></p>
            </div>
          </div>
          <button onClick={closeDetail} className="p-2.5 hover:bg-primary/50 text-text-secondary rounded-xl"><X className="w-6 h-6" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-dark px-6 bg-primary/5 shrink-0 overflow-x-auto no-scrollbar">
          {['Overview', 'Performance', 'Workflow', 'Documents'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("py-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all relative shrink-0", activeTab === tab ? "text-accent" : "text-text-secondary")}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_-2px_15px_rgba(37,99,235,0.8)]" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          {activeTab === 'Overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <Card className="!p-5 bg-accent/5 border border-accent/10 flex flex-col items-start shadow-none relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><Activity className="w-12 h-12" /></div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em] mb-2">Record Status</p>
                  <p className="text-2xl font-black text-text-primary tracking-tighter">{data.status || 'ACTIVE'}</p>
                </Card>
                <Card className="!p-5 bg-success/5 border border-success/10 flex flex-col items-start shadow-none relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><DollarSign className="w-12 h-12" /></div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em] mb-2">Total Value</p>
                  <p className="text-2xl font-black text-text-primary tracking-tighter">{data.value ? formatMoney(data.value) : 'N/A'}</p>
                </Card>
              </div>

              <div className="p-6 border border-border-dark rounded-2xl bg-primary/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <h4 className="text-[10px] font-black text-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Comprehensive Meta Intelligence
                </h4>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <DetailItem label="Source Entity" value={data.supplier || 'INTERNAL'} />
                  <DetailItem label="Record Creation" value={data.date || 'SYST_GEN'} />
                  <DetailItem label="Part Identifier" value={data.partNumber || id} />
                  <DetailItem label="Quantity / UOM" value={`${data.qty || 'N/A'} ${data.uom || ''}`} />
                  {data.department && <DetailItem label="Requesting Dept" value={data.department} />}
                  {data.warehouse && <DetailItem label="Storage Node" value={data.warehouse} />}
                </div>
              </div>

              {type === 'PART' && (
                <div className="p-6 border border-border-dark rounded-2xl bg-surface">
                   <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Inventory Dynamics</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-text-secondary">On-Hand Stock</span>
                        <span className="text-sm font-black text-text-primary">1,240 Units</span>
                      </div>
                      <div className="h-2 bg-primary rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-3/4 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter opacity-50">
                        <span>Lead Time: 14d</span>
                        <span>Safety Stock: 500</span>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'Performance' && (
            <div className="space-y-6">
              <div className="p-4 bg-primary/20 border border-border-dark rounded-2xl h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs><linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563EB" stopOpacity={0}/></linearGradient></defs>
                    <XAxis dataKey="month" hide /><YAxis hide /><RechartsTooltip contentStyle={{ backgroundColor: '#111827', border: 'none' }} />
                    <Area type="monotone" dataKey="value" stroke="#2563EB" fill="url(#colorPerf)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'Workflow' && renderWorkflow()}
          
          {activeTab === 'Documents' && (
            <div className="space-y-3">
              {['Document_v1.pdf', 'Compliance_Check.png', 'Contract_2024.pdf'].map(doc => (
                <div key={doc} className="p-4 bg-primary/20 border border-border-dark rounded-xl flex items-center justify-between hover:border-accent transition-all cursor-pointer">
                  <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-text-secondary" /><span className="text-xs font-bold text-text-primary">{doc}</span></div>
                  <button className="text-[10px] font-black text-accent uppercase px-3 py-1 bg-accent/10 rounded-lg">View</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border-dark bg-primary/20 flex gap-3 shrink-0">
          <button 
            onClick={() => downloadCSV([data], `${type.toLowerCase()}_${id}.csv`)}
            className="flex-1 py-3 bg-surface border border-border-dark rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:border-accent transition-all"
          >
            <DollarSign className="w-3.5 h-3.5 text-success" /> Export CSV
          </button>
          <button 
            onClick={() => downloadPDF(`${type} Scorecard: ${id}`, JSON.stringify(data, null, 2))}
            className="flex-1 py-3 bg-surface border border-border-dark rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:border-accent transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-accent" /> Scorecard
          </button>
          <button className="flex-1 py-3 bg-accent text-white rounded-xl text-[9px] font-black uppercase shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all">
            Execute
          </button>
        </div>
      </div>
    </>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-xs font-bold text-text-primary tracking-tight">{value}</p>
    </div>
  );
}

