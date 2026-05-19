import { useState } from 'react';
import { Search, Filter, Download, Plus, FileText, CheckCircle2, Clock, AlertCircle, Truck, Check, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, Modal } from '../components/ui';
import { globalPOs, globalSuppliers, partTemplates, globalGRNs } from '../data/mockData';
import { downloadCSV } from '../utils/export';
import { useApp } from '../context/AppContext';

export default function PurchaseOrders() {
  const { formatMoney, openDetail, user, hasPermission } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pos, setPos] = useState(globalPOs);

  const [newPO, setNewPO] = useState({
    supplier: '', part: partTemplates[0].name, qty: '', deliveryDate: '', paymentTerms: 'Net 45', incoTerms: 'FOB', shippingAddress: 'Warehouse WH-2, Plot 42, Manesar, HR'
  });

  const handleCreatePO = () => {
    if (!newPO.supplier || !newPO.qty || isNaN(newPO.qty)) return;
    const basePrice = partTemplates.find(p => p.name === newPO.part)?.basePrice || 1000;
    
    const po = {
      id: `PO-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      supplier: newPO.supplier,
      value: parseInt(newPO.qty) * basePrice,
      status: "Pending",
      items: 1,
      lineItems: 1,
      partNumber: partTemplates.find(p => p.name === newPO.part)?.prefix + '-1001',
      partDescription: newPO.part,
      qty: parseInt(newPO.qty),
      deliveryDate: newPO.deliveryDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      daysToDelivery: 14,
      paymentTerms: newPO.paymentTerms,
      incoTerms: newPO.incoTerms,
      shippingAddress: newPO.shippingAddress
    };
    globalPOs.unshift(po);
    setPos([...globalPOs]);
    setIsModalOpen(false);
    setNewPO({ supplier: '', part: partTemplates[0].name, qty: '', deliveryDate: '', paymentTerms: 'Net 45', incoTerms: 'FOB', shippingAddress: 'Warehouse WH-2, Plot 42, Manesar, HR' });
  };

  const handleSupplierAction = (poId, action) => {
    const idx = globalPOs.findIndex(p => p.id === poId);
    if (idx === -1) return;

    if (action === 'ACKNOWLEDGE') {
      globalPOs[idx].status = 'Acknowledged';
    } else if (action === 'SHIP') {
      globalPOs[idx].status = 'Shipped';
      // Simulate GRN creation on shipment
      const newGRN = {
        id: `GRN-2024-${Math.floor(Math.random() * 9000) + 1000}`,
        date: new Date().toISOString().split('T')[0],
        poReference: globalPOs[idx].id,
        supplier: globalPOs[idx].supplier,
        material: globalPOs[idx].partDescription,
        receivedQty: globalPOs[idx].qty,
        acceptedQty: 0,
        rejectedQty: 0,
        status: 'Pending IQC',
        warehouse: 'WH-1',
        threeWayMatch: false,
      };
      globalGRNs.unshift(newGRN);
    }
    setPos([...globalPOs]);
  };
  
  const filteredPOs = pos.filter(po => 
    po.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    open: pos.filter(p => p.status !== 'Closed').length,
    closed: pos.filter(p => p.status === 'Closed').length,
    overdue: pos.filter(p => p.status === 'Overdue').length,
    value: pos.reduce((acc, curr) => acc + curr.value, 0)
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-11rem)] min-h-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Purchase Orders</h1>
          <p className="text-text-secondary text-sm mt-1">Manage, track and acknowledge supplier POs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => downloadCSV(filteredPOs, 'purchase_orders.csv')}
            className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm hover:border-accent flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-accent" /> Export Register (CSV)
          </button>
          {hasPermission('CREATE_PO') && (
            <button className="px-4 py-2 bg-accent text-white rounded-md text-sm font-bold hover:bg-accent/90 flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)]" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" /> Create PO
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <Card className="glass-hover !p-4 flex items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-lg border border-accent/20"><FileText className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Open POs</p><p className="text-2xl font-black text-text-primary">{stats.open}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-lg border border-success/20"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Closed POs</p><p className="text-2xl font-black text-text-primary">{stats.closed}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex items-center gap-4">
          <div className="p-3 bg-danger/10 text-danger rounded-lg border border-danger/20"><AlertCircle className="w-6 h-6" /></div>
          <div><p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Overdue POs</p><p className="text-2xl font-black text-text-primary">{stats.overdue}</p></div>
        </Card>
        <Card className="glass-hover !p-4 flex flex-col justify-center bg-accent/5">
          <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Total Value (YTD)</p><p className="text-xl font-black text-text-primary">{formatMoney(stats.value)}</p>
        </Card>
      </div>

      <Card className="shrink-0 !p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input type="text" placeholder="Search PO Number, Supplier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary border border-border-dark rounded-md pl-10 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all" />
        </div>
      </Card>

      <Card className="flex-1 overflow-hidden flex flex-col p-0 border-t-2 border-t-accent shadow-2xl">
        <div className="overflow-auto flex-1 custom-scrollbar min-h-0">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-text-secondary uppercase bg-surface sticky top-0 z-10 border-b border-border-dark shadow-sm">
              <tr>
                <th className="px-6 py-4 font-medium">PO Number</th>
                <th className="px-6 py-4 font-medium">Supplier & Material</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Delivery</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.slice(0, 500).map((po) => (
                <tr key={po.id} className="border-b border-border-dark hover:bg-primary transition-colors group">
                  <td className="px-6 py-4" onClick={() => openDetail('PO', po.id)}>
                    <div className="font-bold text-accent hover:underline cursor-pointer">{po.id}</div>
                    <div className="text-xs text-text-secondary mt-1">{po.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-text-primary font-bold hover:text-accent hover:underline cursor-pointer" onClick={() => openDetail('SUPPLIER', po.supplier)}>{po.supplier}</div>
                    <div className="text-xs text-text-secondary mt-1 hover:text-accent hover:underline cursor-pointer" onClick={() => openDetail('PART', po.partNumber)}>{po.partNumber} · {po.partDescription}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-text-primary tabular-nums">{formatMoney(po.value)}</td>
                  <td className="px-6 py-4 tabular-nums">
                    <div className={po.daysToDelivery < 0 && po.status !== 'Closed' ? "text-danger font-bold" : "text-text-primary font-medium"}>{po.deliveryDate}</div>
                    {po.daysToDelivery < 0 && po.status !== 'Closed' && <div className="text-[10px] font-bold text-danger uppercase mt-0.5">Overdue</div>}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={po.status === 'Closed' || po.status === 'Received' ? 'default' : po.status === 'Shipped' || po.status === 'Acknowledged' ? 'success' : po.status === 'Overdue' ? 'danger' : 'warning'}>{po.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {user.role === 'SUPPLIER' && po.status === 'Pending' && (
                         <button onClick={() => handleSupplierAction(po.id, 'ACKNOWLEDGE')} className="px-3 py-1 bg-success text-white rounded text-xs font-bold hover:bg-success/90 shadow-sm flex items-center gap-1"><Check className="w-3 h-3" /> Ack</button>
                       )}
                       {user.role === 'SUPPLIER' && po.status === 'Acknowledged' && (
                         <button onClick={() => handleSupplierAction(po.id, 'SHIP')} className="px-3 py-1 bg-accent text-white rounded text-xs font-bold hover:bg-accent/90 shadow-sm flex items-center gap-1"><Truck className="w-3 h-3" /> Ship</button>
                       )}
                       <button onClick={() => openDetail('PO', po.id)} className="p-1.5 bg-surface border border-border-dark rounded-md text-text-secondary hover:text-accent transition-colors"><Eye className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Purchase Order">
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Select Supplier</label>
              <select value={newPO.supplier} onChange={(e) => setNewPO({...newPO, supplier: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none">
                <option value="">Choose vendor...</option>
                {globalSuppliers.slice(0, 50).map((s, i) => <option key={i} value={s.name}>{s.name} ({s.id})</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Material</label>
              <select value={newPO.part} onChange={(e) => setNewPO({...newPO, part: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none">
                {partTemplates.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Qty</label><input type="number" value={newPO.qty} onChange={(e) => setNewPO({...newPO, qty: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-6 border-t border-border-dark sticky bottom-0 bg-surface">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-primary border border-border-dark text-text-secondary rounded-lg hover:text-text-primary transition-all text-sm">Cancel</button>
            <button onClick={handleCreatePO} className="px-6 py-2 bg-accent text-white rounded-lg font-bold shadow-lg hover:bg-accent/90 transition-all text-sm">Create PO</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
