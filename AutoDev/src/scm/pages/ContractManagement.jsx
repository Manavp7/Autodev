import { useState } from 'react';
import { FileSignature, Download, Search, AlertCircle, Clock, Plus, Eye } from 'lucide-react';
import { Card, Badge, Modal } from '../components/ui';
import { globalContracts, globalSuppliers } from '../data/mockData';
import { downloadCSV } from '../utils/export';
import { useApp } from '../context/AppContext';

export default function ContractManagement() {
  const { formatMoney, openDetail } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [contracts, setContracts] = useState(globalContracts);
  const [renewalContract, setRenewalContract] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newContractSupplier, setNewContractSupplier] = useState('');
  const [newContractType, setNewContractType] = useState('Rate Contract');

  const filteredContracts = contracts.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    active: contracts.filter(c => c.status === 'Active').length,
    expiring30: contracts.filter(c => c.daysToExpiry > 0 && c.daysToExpiry <= 30).length,
    expiring60: contracts.filter(c => c.daysToExpiry > 30 && c.daysToExpiry <= 60).length,
    expired: contracts.filter(c => c.status === 'Expired').length,
    totalValue: contracts.reduce((acc, curr) => acc + curr.value, 0)
  };

  const handleRenewal = () => {
    if (!renewalContract) return;
    const idx = globalContracts.findIndex(c => c.id === renewalContract.id);
    if (idx !== -1) {
      const newEnd = new Date();
      newEnd.setFullYear(newEnd.getFullYear() + 1);
      globalContracts[idx].endDate = newEnd.toISOString().split('T')[0];
      globalContracts[idx].daysToExpiry = 365;
      globalContracts[idx].status = 'Active';
    }
    setContracts([...globalContracts]);
    setRenewalContract(null);
  };

  const handleCreateContract = () => {
    if (!newContractSupplier) return;
    const start = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    const newContract = {
      id: `CNT-2024-${Math.floor(Math.random() * 900) + 100}`,
      supplier: newContractSupplier,
      type: newContractType,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 5000000) + 500000,
      status: 'Active',
      daysToExpiry: 365,
      paymentTerms: 'Net 45 Days',
    };
    globalContracts.unshift(newContract);
    setContracts([...globalContracts]);
    setIsCreateOpen(false);
    setNewContractSupplier('');
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Contract Management</h1>
          <p className="text-text-secondary text-sm mt-1">Manage rate contracts, SLAs, and upcoming expirations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => downloadCSV(filteredContracts, 'contracts_export.csv')}
            className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm hover:border-accent flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-accent" /> Export Register (CSV)
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2 bg-accent text-white rounded-md text-sm font-bold hover:bg-accent/90 flex items-center gap-2 transition-all shadow-lg">
            <Plus className="w-4 h-4" /> New Contract
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <Card className="glass-hover !p-4 flex items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-lg border border-accent/20"><FileSignature className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Active</p><p className="text-2xl font-black text-text-primary">{stats.active}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4 border-b-2 border-b-danger">
          <div className="p-3 bg-danger/10 text-danger rounded-lg border border-danger/20"><AlertCircle className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Expiring &lt;30d</p><p className="text-2xl font-black text-text-primary">{stats.expiring30}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4 border-b-2 border-b-warning">
          <div className="p-3 bg-warning/10 text-warning rounded-lg border border-warning/20"><Clock className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Expiring 30-60d</p><p className="text-2xl font-black text-text-primary">{stats.expiring60}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4 bg-accent/5">
          <div className="p-3 bg-accent/10 text-accent rounded-lg border border-accent/20"><Clock className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Total Value</p><p className="text-xl font-black text-text-primary">{formatMoney(stats.totalValue)}</p></div>
        </Card>
      </div>

      <Card className="shrink-0 !p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input type="text" placeholder="Search contract ID, supplier, type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary border border-border-dark rounded-md pl-10 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all" />
        </div>
      </Card>

      <Card className="flex-1 overflow-hidden flex flex-col p-0 border-t-2 border-t-accent">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-text-secondary uppercase bg-surface sticky top-0 z-10 border-b border-border-dark shadow-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Contract ID</th>
                <th className="px-6 py-4 font-medium">Supplier & Type</th>
                <th className="px-6 py-4 font-medium">Validity Period</th>
                <th className="px-6 py-4 font-medium">Total Value</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.slice(0, 500).map((contract) => (
                <tr key={contract.id} className="border-b border-border-dark hover:bg-primary transition-colors group">
                  <td className="px-6 py-4" onClick={() => openDetail('CONTRACT', contract.id)}>
                    <div className="font-bold text-accent hover:underline cursor-pointer transition-colors">{contract.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-text-primary font-bold hover:text-accent hover:underline cursor-pointer transition-colors" onClick={() => openDetail('SUPPLIER', contract.supplier)}>{contract.supplier}</div>
                    <div className="text-xs text-text-secondary mt-1 uppercase tracking-tight font-medium">{contract.type}</div>
                  </td>
                  <td className="px-6 py-4 tabular-nums">
                    <div className="text-text-primary text-sm font-medium">{contract.startDate} — {contract.endDate}</div>
                    {contract.status === 'Active' && contract.daysToExpiry <= 60 && (
                      <div className={`text-[10px] font-bold uppercase mt-1 ${contract.daysToExpiry <= 30 ? 'text-danger' : 'text-warning'}`}>
                        Expires in {contract.daysToExpiry} days
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-text-primary tabular-nums">{formatMoney(contract.value)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={contract.status === 'Active' ? 'success' : 'danger'}>{contract.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {contract.status === 'Active' && contract.daysToExpiry <= 60 ? (
                        <button onClick={() => setRenewalContract(contract)} className="px-3 py-1 bg-accent text-white rounded text-xs font-bold hover:bg-accent/90 transition-all shadow-sm">Renew</button>
                      ) : (
                        <button onClick={() => openDetail('CONTRACT', contract.id)} className="p-1.5 bg-surface border border-border-dark rounded-md text-text-secondary hover:text-accent transition-colors"><Eye className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={!!renewalContract} onClose={() => setRenewalContract(null)} title="Initiate Contract Renewal">
        {renewalContract && (
          <div className="space-y-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
              <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Contract</p>
              <p className="text-sm font-bold text-accent">{renewalContract.id} — {renewalContract.supplier}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Renewal Period</label>
              <select className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary outline-none focus:border-accent">
                <option>+ 1 Year</option><option>+ 2 Years</option><option>+ 3 Years</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border-dark">
              <button onClick={() => setRenewalContract(null)} className="px-4 py-2 bg-primary border border-border-dark text-text-secondary rounded-lg hover:text-text-primary transition-all text-sm">Cancel</button>
              <button onClick={handleRenewal} className="px-6 py-2 bg-accent text-white rounded-lg font-bold hover:bg-accent/90 transition-all shadow-lg">Confirm Renewal</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Contract Drafting">
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Select Supplier</label>
            <select value={newContractSupplier} onChange={(e) => setNewContractSupplier(e.target.value)} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none">
              <option value="">Vendor pool...</option>
              {globalSuppliers.slice(0, 50).map((s, i) => <option key={i} value={s.name}>{s.name} ({s.id})</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Contract Type</label>
            <select value={newContractType} onChange={(e) => setNewContractType(e.target.value)} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none">
              <option>Rate Contract</option><option>Annual Maintenance</option><option>Master Service Agreement</option><option>NDA</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border-dark">
            <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 bg-primary border border-border-dark text-text-secondary rounded-lg hover:text-text-primary transition-all text-sm">Cancel</button>
            <button onClick={handleCreateContract} className="px-6 py-2 bg-accent text-white rounded-lg font-bold hover:bg-accent/90 transition-all shadow-lg">Draft Contract</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
