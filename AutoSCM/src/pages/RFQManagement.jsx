import { useState } from 'react';
import { Search, Download, Plus, FileSpreadsheet, CheckCircle2, Clock, Eye, Gavel, Trophy } from 'lucide-react';
import { Card, Badge, Modal } from '../components/ui';
import { globalRFQs, globalPRs, partTemplates, globalSuppliers } from '../data/mockData';
import { downloadCSV } from '../utils/export';
import { useApp } from '../context/AppContext';

export default function RFQManagement() {
  const { formatMoney, openDetail, hasPermission, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rfqs, setRfqs] = useState(globalRFQs);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [compareBidsRFQ, setCompareBidsRFQ] = useState(null);
  const [newRFQ, setNewRFQ] = useState({
    pr: '', part: partTemplates[0].name, supplierCount: '3', deadline: '', type: 'Reverse Auction', techSpecs: '', commercialTerms: '100% Payment within 30 days of GRN'
  });

  const handleCreateRFQ = () => {
    const part = partTemplates.find(p => p.name === newRFQ.part) || partTemplates[0];
    const rfq = {
      id: `RFQ-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      prReference: newRFQ.pr || "Direct",
      partNumber: `${part.prefix}-${Math.floor(Math.random() * 8000) + 1000}`,
      description: part.name,
      invitedSuppliers: parseInt(newRFQ.supplierCount),
      quotesReceived: 0,
      deadline: newRFQ.deadline || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      status: "Awaiting Quotes",
      type: newRFQ.type,
      techSpecs: newRFQ.techSpecs,
      commercialTerms: newRFQ.commercialTerms,
      daysRemaining: 5
    };
    globalRFQs.unshift(rfq);
    setRfqs([...globalRFQs]);
    setIsModalOpen(false);
  };

  const handleAward = (rfqId, supplierName) => {
    const idx = globalRFQs.findIndex(r => r.id === rfqId);
    if (idx !== -1) {
      globalRFQs[idx].status = 'Awarded';
      globalRFQs[idx].awardedTo = supplierName;
      globalRFQs[idx].awardedAt = new Date().toISOString().split('T')[0];
      globalRFQs[idx].awardedBy = user.name;
    }
    setRfqs([...globalRFQs]);
    setCompareBidsRFQ(null);
  };
  
  const filteredRFQs = rfqs.filter(rfq => 
    rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rfq.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-11rem)] min-h-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">RFQ / Tender Management</h1>
          <p className="text-text-secondary text-sm mt-1">Manage requests for quotations, compare bids, and award contracts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => downloadCSV(filteredRFQs, 'rfq_export.csv')}
            className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm hover:border-accent flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-accent" /> Export (CSV)
          </button>
          {hasPermission('AWARD_RFQ') && (
            <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-bold hover:bg-accent/90 flex items-center gap-2 transition-all shadow-lg" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" /> Create RFQ
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <Card className="glass-hover !p-4 flex items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-lg border border-accent/20"><FileSpreadsheet className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Active RFQs</p><p className="text-2xl font-black text-text-primary">{rfqs.filter(p => p.status !== 'Awarded' && p.status !== 'Closed').length}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4">
          <div className="p-3 bg-warning/10 text-warning rounded-lg border border-warning/20"><Clock className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Awaiting Quotes</p><p className="text-2xl font-black text-text-primary">{rfqs.filter(p => p.status === 'Awaiting Quotes').length}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4 bg-success/5">
          <div className="p-3 bg-success/10 text-success rounded-lg border border-success/20"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-success uppercase tracking-wider mb-1">Awarded (YTD)</p><p className="text-2xl font-black text-text-primary">{rfqs.filter(p => p.status === 'Awarded').length}</p></div>
        </Card>
      </div>

      <Card className="shrink-0 !p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input type="text" placeholder="Search RFQ ID, Description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary border border-border-dark rounded-md pl-10 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all" />
        </div>
      </Card>

      <Card className="flex-1 overflow-hidden flex flex-col p-0 border-t-2 border-t-accent shadow-2xl">
        <div className="overflow-auto flex-1 custom-scrollbar min-h-0">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-text-secondary uppercase bg-surface sticky top-0 z-10 border-b border-border-dark shadow-sm">
              <tr>
                <th className="px-6 py-4 font-medium">RFQ ID</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Responses</th>
                <th className="px-6 py-4 font-medium">Deadline</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRFQs.slice(0, 500).map((rfq) => (
                <tr key={rfq.id} className="border-b border-border-dark hover:bg-primary transition-colors group">
                  <td className="px-6 py-4" onClick={() => openDetail('RFQ', rfq.id)}>
                    <div className="font-bold text-accent hover:underline cursor-pointer">{rfq.id}</div>
                    <div className="text-[10px] text-text-secondary mt-1">{rfq.prReference}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-text-primary">{rfq.description}</div>
                  </td>
                  <td className="px-6 py-4 tabular-nums">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">{rfq.invitedSuppliers}</span>
                      <span className="text-text-secondary">/</span>
                      <span className={rfq.quotesReceived === 0 ? "text-danger" : "text-success font-bold"}>{rfq.quotesReceived}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 tabular-nums">
                    <div className="text-text-primary font-medium">{rfq.deadline}</div>
                    {rfq.status === 'Awaiting Quotes' && <div className="text-[10px] text-warning font-bold uppercase mt-0.5">{rfq.daysRemaining} days left</div>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={rfq.status === 'Awarded' ? 'success' : rfq.status === 'Under Evaluation' ? 'accent' : 'warning'}>{rfq.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {rfq.status === 'Under Evaluation' && hasPermission('AWARD_RFQ') ? (
                         <button onClick={() => setCompareBidsRFQ(rfq)} className="px-3 py-1 bg-accent text-white rounded text-xs font-bold hover:bg-accent/90 shadow-sm flex items-center gap-1"><Gavel className="w-3 h-3" /> Award</button>
                       ) : (
                         <button onClick={() => openDetail('RFQ', rfq.id)} className="p-1.5 bg-surface border border-border-dark rounded-md text-text-secondary hover:text-accent transition-colors"><Eye className="w-4 h-4" /></button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Floating New RFQ">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Linked Approved PR</label>
              <select value={newRFQ.pr} onChange={(e) => setNewRFQ({...newRFQ, pr: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary outline-none focus:border-accent">
                <option value="">No PR Linked</option>
                {globalPRs.filter(p => p.status === 'Approved').map((p, i) => <option key={i} value={p.id}>{p.id} — {p.description}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Invites</label>
              <input type="number" value={newRFQ.supplierCount} onChange={(e) => setNewRFQ({...newRFQ, supplierCount: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Deadline</label>
              <input type="date" value={newRFQ.deadline} onChange={(e) => setNewRFQ({...newRFQ, deadline: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary outline-none focus:border-accent" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-6 border-t border-border-dark">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-primary border border-border-dark text-text-secondary rounded-lg hover:text-text-primary transition-all text-sm">Cancel</button>
            <button onClick={handleCreateRFQ} className="px-6 py-2 bg-accent text-white rounded-lg font-bold shadow-lg hover:bg-accent/90 transition-all text-sm">Float RFQ</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!compareBidsRFQ} onClose={() => setCompareBidsRFQ(null)} title={`Tender Evaluation — ${compareBidsRFQ?.id}`}>
        {compareBidsRFQ && (
          <div className="space-y-6">
            <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl">
              <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Item Description</p>
              <p className="text-sm font-bold text-text-primary">{compareBidsRFQ.description}</p>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Bosch India', price: 1250000, rank: 'L1' },
                { name: 'Motherson Sumi', price: 1320000, rank: 'L2' },
                { name: 'Varroc Engineering', price: 1450000, rank: 'L3' }
              ].map((bid, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-primary border border-border-dark rounded-2xl group hover:border-accent transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${bid.rank === 'L1' ? 'bg-success/20 text-success' : 'bg-surface text-text-secondary'}`}>{bid.rank}</div>
                    <div>
                      <p className="font-bold text-text-primary">{bid.name}</p>
                      <p className="text-[10px] text-text-secondary uppercase">Unit Price Quote</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-black text-text-primary tabular-nums">{formatMoney(bid.price)}</p>
                    <button onClick={() => handleAward(compareBidsRFQ.id, bid.name)} className="px-4 py-1.5 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent/90 transition-all shadow-md flex items-center gap-1"><Trophy className="w-3 h-3" /> Award</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
