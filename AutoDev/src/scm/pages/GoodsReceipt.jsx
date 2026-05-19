import { useState } from 'react';
import { Search, Download, Plus, PackageCheck, AlertCircle, CheckCircle2, Eye, ShieldCheck, XCircle } from 'lucide-react';
import { Card, Badge, Modal } from '../components/ui';
import { globalGRNs, globalPOs, globalSuppliers, partTemplates } from '../data/mockData';
import { downloadCSV } from '../utils/export';
import { useApp } from '../context/AppContext';

export default function GoodsReceipt() {
  const { openDetail, hasPermission, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [grns, setGrns] = useState(globalGRNs);
  const [iqcGrn, setIqcGrn] = useState(null);

  const [grnPO, setGrnPO] = useState('');
  const [grnMaterial, setGrnMaterial] = useState(partTemplates[0].name);
  const [grnQty, setGrnQty] = useState('');

  const handleCreateGRN = () => {
    if (!grnQty || isNaN(grnQty)) return;
    const qty = parseInt(grnQty);
    const po = globalPOs.find(p => p.id === grnPO);
    const newGRN = {
      id: `GRN-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      poReference: grnPO || 'N/A',
      supplier: po ? po.supplier : 'N/A',
      material: grnMaterial,
      receivedQty: qty,
      acceptedQty: 0,
      rejectedQty: 0,
      status: 'Pending IQC',
      warehouse: 'WH-1',
      threeWayMatch: false,
    };
    globalGRNs.unshift(newGRN);
    setGrns([...globalGRNs]);
    setIsModalOpen(false);
    setGrnPO('');
  };

  const handleIQC = (status) => {
    if (!iqcGrn) return;
    const idx = globalGRNs.findIndex(g => g.id === iqcGrn.id);
    if (idx === -1) return;

    globalGRNs[idx].status = status;
    globalGRNs[idx].acceptedQty = status === 'Accepted' ? globalGRNs[idx].receivedQty : 0;
    globalGRNs[idx].rejectedQty = status === 'Rejected' ? globalGRNs[idx].receivedQty : 0;
    globalGRNs[idx].inspectedBy = user.name;
    globalGRNs[idx].inspectedAt = new Date().toISOString().split('T')[0];

    // Update PO status if accepted
    if (status === 'Accepted') {
      const poIdx = globalPOs.findIndex(p => p.id === globalGRNs[idx].poReference);
      if (poIdx !== -1) {
        globalPOs[poIdx].status = 'Received';
      }
    }

    setGrns([...globalGRNs]);
    setIqcGrn(null);
  };
  
  const filteredGRNs = grns.filter(grn => 
    grn.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    grn.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grn.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-11rem)] min-h-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Goods Receipt (GRN)</h1>
          <p className="text-text-secondary text-sm mt-1">Manage incoming material, IQC disposition, and warehouse putaway.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => downloadCSV(grns, 'grn_register.csv')}
            className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm hover:border-accent flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-accent" /> Export Register (CSV)
          </button>
          {!hasPermission('SHIP_ORDER') && (
            <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-bold hover:bg-accent/90 flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)]" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" /> Gate Entry
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <Card className="glass-hover !p-4 flex items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-lg border border-accent/20"><PackageCheck className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Today's Arrivals</p><p className="text-2xl font-black text-text-primary">12</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4">
          <div className="p-3 bg-warning/10 text-warning rounded-lg border border-warning/20"><AlertCircle className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Pending IQC</p><p className="text-2xl font-black text-text-primary">{grns.filter(g => g.status === 'Pending IQC').length}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4 bg-success/5">
          <div className="p-3 bg-success/10 text-success rounded-lg border border-success/20"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-success uppercase tracking-wider mb-1">Accepted (MTD)</p><p className="text-2xl font-black text-text-primary">142</p></div>
        </Card>
      </div>

      <Card className="shrink-0 !p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input type="text" placeholder="Search GRN, PO, Supplier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary border border-border-dark rounded-md pl-10 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all" />
        </div>
      </Card>

      <Card className="flex-1 overflow-hidden flex flex-col p-0 border-t-2 border-t-accent shadow-2xl">
        <div className="overflow-auto flex-1 custom-scrollbar min-h-0">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-text-secondary uppercase bg-surface sticky top-0 z-10 border-b border-border-dark shadow-sm">
              <tr>
                <th className="px-6 py-4 font-medium">GRN No</th>
                <th className="px-6 py-4 font-medium">Source & Supplier</th>
                <th className="px-6 py-4 font-medium">Material</th>
                <th className="px-6 py-4 font-medium">Qty (Recv/Acpt)</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGRNs.slice(0, 500).map((grn) => (
                <tr key={grn.id} className="border-b border-border-dark hover:bg-primary transition-colors group">
                  <td className="px-6 py-4" onClick={() => openDetail('GRN', grn.id)}>
                    <div className="font-bold text-accent hover:underline cursor-pointer">{grn.id}</div>
                    <div className="text-xs text-text-secondary mt-1">{grn.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-text-primary font-bold hover:text-accent hover:underline cursor-pointer transition-colors" onClick={() => openDetail('SUPPLIER', grn.supplier)}>{grn.supplier}</div>
                    <div className="text-xs text-accent mt-1 hover:underline cursor-pointer" onClick={() => openDetail('PO', grn.poReference)}>{grn.poReference}</div>
                  </td>
                  <td className="px-6 py-4" onClick={() => openDetail('PART', grn.material)}>
                    <div className="font-bold text-text-primary hover:text-accent hover:underline cursor-pointer">{grn.material}</div>
                  </td>
                  <td className="px-6 py-4 tabular-nums font-bold">
                    <span className="text-text-primary">{grn.receivedQty}</span>
                    <span className="text-text-secondary mx-2">/</span>
                    <span className={grn.acceptedQty > 0 ? "text-success" : "text-text-secondary"}>{grn.acceptedQty}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={grn.status === 'Accepted' ? 'success' : grn.status === 'Rejected' ? 'danger' : 'warning'}>{grn.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {grn.status === 'Pending IQC' && hasPermission('IQC_GRN') ? (
                         <button onClick={() => setIqcGrn(grn)} className="px-3 py-1 bg-accent text-white rounded text-xs font-bold hover:bg-accent/90 shadow-sm flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> IQC</button>
                       ) : (
                         <button onClick={() => openDetail('GRN', grn.id)} className="p-1.5 bg-surface border border-border-dark rounded-md text-text-secondary hover:text-accent transition-colors"><Eye className="w-4 h-4" /></button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={!!iqcGrn} onClose={() => setIqcGrn(null)} title={`Inbound Quality Control — ${iqcGrn?.id}`}>
        {iqcGrn && (
          <div className="space-y-6">
            <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-accent/10 text-accent rounded-lg"><PackageCheck className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-bold text-text-primary">{iqcGrn.material}</p>
                <p className="text-xs text-text-secondary mt-0.5">Supplier: {iqcGrn.supplier} · Qty: {iqcGrn.receivedQty}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleIQC('Accepted')} className="flex flex-col items-center justify-center p-6 bg-success/5 border border-success/20 rounded-2xl hover:bg-success/10 transition-all group">
                <ShieldCheck className="w-10 h-10 text-success mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-success">ACCEPT ALL</p>
                <p className="text-[10px] text-success/60 uppercase mt-1">Conforms to IATF Specs</p>
              </button>
              <button onClick={() => handleIQC('Rejected')} className="flex flex-col items-center justify-center p-6 bg-danger/5 border border-danger/20 rounded-2xl hover:bg-danger/10 transition-all group">
                <XCircle className="w-10 h-10 text-danger mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-danger">REJECT ALL</p>
                <p className="text-[10px] text-danger/60 uppercase mt-1">Non-conforming material</p>
              </button>
            </div>

            <div className="p-3 bg-surface border border-border-dark rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-text-secondary" />
              <p className="text-[10px] text-text-secondary">Disposition will trigger automatic update to PO {iqcGrn.poReference} status.</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manual Gate Entry">
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Source PO</label>
            <select value={grnPO} onChange={(e) => setGrnPO(e.target.value)} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary outline-none focus:border-accent">
              <option value="">Select PO...</option>
              {globalPOs.filter(p => p.status === 'Shipped').map((p, i) => <option key={i} value={p.id}>{p.id} — {p.supplier}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-6 border-t border-border-dark">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-primary border border-border-dark text-text-secondary rounded-lg hover:text-text-primary transition-all text-sm">Cancel</button>
            <button onClick={handleCreateGRN} className="px-6 py-2 bg-accent text-white rounded-lg font-bold shadow-lg hover:bg-accent/90 transition-all text-sm">Acknowledge Arrival</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
