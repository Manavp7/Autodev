import { useState } from 'react';
import { Search, Download, Plus, FileText, CheckCircle2, Clock, XCircle, Eye } from 'lucide-react';
import { Card, Badge, Modal } from '../components/ui';
import { globalPRs, partTemplates } from '../data/mockData';
import { downloadCSV } from '../utils/export';
import { useApp } from '../context/AppContext';
import { useEventBusEffect } from '../../stores/eventBus';

export default function PurchaseRequisitions() {
  const { formatMoney, openDetail, hasPermission, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [prs, setPrs] = useState(globalPRs);

  // Helper used by both manual and event-driven PR creation
  const insertPR = (partial) => {
    const pr = {
      id: `PR-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      requestor: partial.requestor ?? (user?.name || 'System'),
      department: partial.department ?? 'Engineering',
      partNumber: partial.partNumber ?? `PN-NEW-${Math.floor(Math.random() * 8000) + 1000}`,
      description: partial.description ?? 'Auto-generated PR',
      qty: partial.qty ?? 1,
      uom: 'Nos',
      requiredDate: partial.requiredDate ?? new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      estCost: partial.estCost ?? (partial.qty ?? 1) * 5000,
      status: 'Pending Approval',
      urgency: partial.urgency ?? 'Normal',
      location: 'Gurgaon Plant',
      remarks: partial.remarks ?? '',
      approver: 'TBD',
    };
    globalPRs.unshift(pr);
    setPrs([...globalPRs]);
    return pr;
  };

  // Handoff #2: ECO approved -> auto-create PRs for affected parts
  useEventBusEffect('eco.approved', (e) => {
    e.affectedParts.forEach((pn) => {
      insertPR({
        partNumber: pn,
        description: `Replacement parts per ECO ${e.ecoId} (cut-in ${e.cutInDate})`,
        qty: 50,
        urgency: 'High',
        department: 'Engineering',
        remarks: `Triggered by ECO ${e.ecoId}`,
      });
    });
  });

  // Handoff #3: Prototype parts needed -> priority PR
  useEventBusEffect('prototype.parts.needed', (e) => {
    e.parts.forEach((p) => {
      insertPR({
        partNumber: p.pn,
        description: `Prototype parts for program ${e.programId}`,
        qty: p.qty,
        urgency: 'Critical',
        department: 'R&D',
        remarks: `Prototype build order — program ${e.programId}`,
      });
    });
  });
  const [newPR, setNewPR] = useState({
    department: 'Production', selectedPart: partTemplates[0].name, customPartDesc: '', qty: '', urgency: 'Normal', targetPrice: '', location: 'Gurgaon Plant', remarks: ''
  });

  const handleCreatePR = () => {
    let partDesc = newPR.selectedPart;
    let basePrice = 1000;
    
    if (newPR.selectedPart === 'ADD_NEW') {
      partDesc = newPR.customPartDesc;
      if (!partDesc) return;
    } else {
      const t = partTemplates.find(p => p.name === newPR.selectedPart);
      if (t) basePrice = t.basePrice;
    }
    
    if (!newPR.qty || isNaN(newPR.qty)) return;

    const pr = {
      id: `PR-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      requestor: user.name,
      department: newPR.department,
      partNumber: `PN-NEW-${Math.floor(Math.random() * 8000) + 1000}`,
      description: partDesc,
      qty: parseInt(newPR.qty),
      uom: "Nos",
      requiredDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      estCost: parseInt(newPR.qty) * (Number(newPR.targetPrice) || basePrice),
      status: "Pending Approval",
      urgency: newPR.urgency,
      location: newPR.location,
      remarks: newPR.remarks,
      approver: "TBD"
    };

    globalPRs.unshift(pr);
    setPrs([...globalPRs]);
    setIsModalOpen(false);
    setNewPR({ department: 'Production', selectedPart: partTemplates[0].name, customPartDesc: '', qty: '', urgency: 'Normal', targetPrice: '', location: 'Gurgaon Plant', remarks: '' });
  };
  
  const filteredPRs = prs.filter(pr => 
    pr.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.requestor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-11rem)] min-h-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Purchase Requisitions</h1>
          <p className="text-text-secondary text-sm mt-1">Review, approve, and convert internal PRs to POs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => downloadCSV(filteredPRs, 'purchase_requisitions.csv')}
            className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm hover:border-accent flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-accent" /> Export Register (CSV)
          </button>
          <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-bold hover:bg-accent/90 flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)]" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" /> Create PR
          </button>
        </div>
      </div>

      <Card className="shrink-0 !p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search PR Number, Description, Requestor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary border border-border-dark rounded-md pl-10 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all"
          />
        </div>
      </Card>

      <Card className="flex-1 overflow-hidden flex flex-col p-0 border-t-2 border-t-accent shadow-2xl">
        <div className="overflow-auto flex-1 custom-scrollbar min-h-0">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-text-secondary uppercase bg-surface sticky top-0 z-10 border-b border-border-dark shadow-sm">
              <tr>
                <th className="px-6 py-4 font-medium">PR Reference</th>
                <th className="px-6 py-4 font-medium">Requestor / Dept</th>
                <th className="px-6 py-4 font-medium">Item Details</th>
                <th className="px-6 py-4 font-medium">Est. Cost</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPRs.slice(0, 500).map((pr) => (
                <tr key={pr.id} className="border-b border-border-dark hover:bg-primary transition-colors group">
                  <td className="px-6 py-4" onClick={() => openDetail('PR', pr.id)}>
                    <div className="font-bold text-accent hover:underline cursor-pointer transition-colors">{pr.id}</div>
                    <div className="text-xs text-text-secondary mt-1">{pr.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-text-primary font-bold">{pr.requestor}</div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-tight mt-0.5">{pr.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-text-primary hover:text-accent hover:underline cursor-pointer transition-colors" onClick={() => openDetail('PART', pr.partNumber)}>{pr.partNumber}</div>
                    <div className="text-xs text-text-secondary mt-0.5 hover:text-accent hover:underline cursor-pointer transition-colors" onClick={() => openDetail('PART', pr.partNumber)}>{pr.description} ({pr.qty} {pr.uom})</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-text-primary tabular-nums">
                    {formatMoney(pr.estCost)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={
                      pr.status === 'Approved' ? 'success' : 
                      pr.status === 'Rejected' ? 'danger' : 
                      pr.status === 'Converted' ? 'default' : 'warning'
                    }>
                      {pr.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {pr.status === 'Pending Approval' && hasPermission('APPROVE_PR') ? (
                         <>
                           <button 
                             onClick={() => {
                               const idx = prs.findIndex(p => p.id === pr.id);
                               prs[idx].status = 'Approved';
                               prs[idx].approver = user.name;
                               setPrs([...prs]);
                             }}
                             className="px-3 py-1 bg-success text-white rounded text-xs font-bold hover:bg-success/90 transition-all shadow-lg"
                           >
                             Approve
                           </button>
                           <button 
                             onClick={() => {
                               const idx = prs.findIndex(p => p.id === pr.id);
                               prs[idx].status = 'Rejected';
                               setPrs([...prs]);
                             }}
                             className="px-3 py-1 bg-danger text-white rounded text-xs font-bold hover:bg-danger/90 transition-all shadow-lg"
                           >
                             Reject
                           </button>
                         </>
                       ) : (
                         <button onClick={() => openDetail('PR', pr.id)} className="p-1.5 bg-surface border border-border-dark rounded-md text-text-secondary hover:text-accent transition-colors">
                           <Eye className="w-4 h-4" />
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Purchase Requisition">
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar p-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Department</label>
              <select value={newPR.department} onChange={(e) => setNewPR({...newPR, department: e.target.value})} className="w-full bg-primary border border-border-dark rounded-lg px-4 py-2.5 text-sm text-text-primary focus:border-accent outline-none">
                <option>Production</option><option>Maintenance</option><option>Quality</option><option>R&D</option><option>IT</option><option>Facilities</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Urgency</label>
              <select value={newPR.urgency} onChange={(e) => setNewPR({...newPR, urgency: e.target.value})} className="w-full bg-primary border border-border-dark rounded-lg px-4 py-2.5 text-sm text-text-primary focus:border-accent outline-none">
                <option>Normal</option><option>High</option><option>Critical (Line Stop)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border-dark sticky bottom-0 bg-surface">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-primary border border-border-dark text-text-secondary rounded-lg hover:text-text-primary transition-all text-sm">Cancel</button>
            <button onClick={handleCreatePR} className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all text-sm font-bold shadow-lg">Submit Requisition</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
