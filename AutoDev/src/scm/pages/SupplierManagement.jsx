import { useState } from 'react';
import { Download, Search, Filter, Plus, FileText, CheckCircle, AlertTriangle, Shield, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge, Modal } from '../components/ui';
import { globalSuppliers } from '../data/mockData';
import { downloadCSV } from '../utils/export';
import { useApp } from '../context/AppContext';
import { useEventBusEffect } from '../../stores/eventBus';
import { useNotificationStore } from '../../stores/notificationStore';

export default function SupplierManagement() {
  const { formatMoney } = useApp();
  const pushNotification = useNotificationStore((s) => s.push);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [pendingPpapTasks, setPendingPpapTasks] = useState([]);

  const [suppliers, setSuppliers] = useState(globalSuppliers);

  // Handoff #4: APQP / PPAP kickoff -> Supplier shows pending PPAP task
  useEventBusEffect('ppap.kickoff', (e) => {
    setPendingPpapTasks((prev) => [
      { supplierId: e.supplierId, partNumber: e.partNumber, queuedAt: new Date().toISOString() },
      ...prev,
    ]);
    pushNotification({
      title: `PPAP Kickoff: ${e.partNumber}`,
      message: `Supplier ${e.supplierId} has a new PPAP submission task.`,
      type: 'warning',
      category: 'PPAP',
      module: 'SCM',
    });
  });
  const [newSup, setNewSup] = useState({
    name: '', category: 'Raw Materials', address: '', gst: '', contactName: '', email: '', phone: '', paymentTerms: 'Net 30', bankAccount: '', ifsc: ''
  });

  const handleOnboard = () => {
    if (!newSup.name) return;
    const s = {
      id: `SUP-${Math.floor(Math.random() * 9000) + 1000}`,
      ...newSup,
      tier: "Tier 2",
      certifications: ["ISO 9001"],
      auditScore: "85.0",
      riskRating: "Low",
      otd: "100.0",
      iqc: "100.0",
      ppap: "100.0",
      ncrCount: 0,
      score: "100.0",
      rating: "Silver",
      status: "Active",
      onboardingDate: new Date().toISOString().split('T')[0],
      spendYTD: 0,
    };
    globalSuppliers.unshift(s);
    setSuppliers([...globalSuppliers]);
    setIsModalOpen(false);
    setNewSup({ name: '', category: 'Raw Materials', address: '', gst: '', contactName: '', email: '', phone: '', paymentTerms: 'Net 30', bankAccount: '', ifsc: '' });
  };
  
  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-11rem)] min-h-0">
      {pendingPpapTasks.length > 0 && (
        <div className="mb-4 rounded-2xl border border-warning/40 bg-warning/10 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-warning" />
            <div>
              <p className="text-sm font-black text-warning uppercase tracking-tight">Pending PPAP Submissions</p>
              <p className="text-[11px] text-text-secondary">
                {pendingPpapTasks.length} active task(s) — latest: {pendingPpapTasks[0].partNumber} for {pendingPpapTasks[0].supplierId}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPendingPpapTasks([])}
            className="text-warning text-xs font-bold uppercase tracking-widest hover:underline"
          >
            Dismiss All
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Supplier Management</h1>
          <p className="text-text-secondary text-sm mt-1">Manage vendor relationships, onboarding, and performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => downloadCSV(filteredSuppliers, 'suppliers_export.csv')}
            className="px-4 py-2 bg-surface border border-border-dark rounded-md text-sm hover:border-accent flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Register (CSV)
          </button>
          <button className="px-4 py-2 bg-accent text-text-primary rounded-md text-sm hover:bg-accent/90 flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" /> Onboard Supplier
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="mb-6 shrink-0 !p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-primary border border-border-dark rounded-md pl-10 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-accent min-w-[150px]">
              <option>All Categories</option>
              <option>Engine Components</option>
              <option>Body Parts</option>
              <option>Electronics</option>
            </select>
            <select className="bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-accent min-w-[130px]">
              <option>All Ratings</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>Bronze</option>
              <option>Critical</option>
            </select>
            <button className="p-2 border border-border-dark rounded-md bg-surface text-text-secondary hover:text-text-primary transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="flex-1 overflow-hidden flex flex-col p-0 border-t-2 border-t-accent shadow-2xl">
        <div className="overflow-auto flex-1 custom-scrollbar min-h-0">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-text-secondary uppercase bg-surface sticky top-0 z-10 border-b border-border-dark shadow-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">Category / Tier</th>
                <th className="px-6 py-4 font-medium">OTD / IQC</th>
                <th className="px-6 py-4 font-medium">Risk Rating</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.slice(0, 500).map((supplier) => (
                <tr 
                  key={supplier.id} 
                  onClick={() => setSelectedSupplier(supplier)}
                  className="border-b border-border-dark hover:bg-primary transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary group-hover:text-accent transition-colors">{supplier.name}</div>
                    <div className="text-xs text-text-secondary mt-1">{supplier.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-text-primary">{supplier.category}</div>
                    <div className="text-xs text-text-secondary mt-1">{supplier.tier}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-8 text-text-secondary">OTD:</span>
                        <span className={supplier.otd > 90 ? 'text-success' : supplier.otd < 80 ? 'text-danger' : 'text-warning'}>{supplier.otd}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-8 text-text-secondary">IQC:</span>
                        <span className={supplier.iqc > 95 ? 'text-success' : supplier.iqc < 85 ? 'text-danger' : 'text-warning'}>{supplier.iqc}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={supplier.rating === 'Gold' ? 'success' : supplier.rating === 'Critical' ? 'danger' : supplier.rating === 'Silver' ? 'default' : 'warning'}>
                      {supplier.rating}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${supplier.status === 'Active' ? 'bg-success' : 'bg-danger'}`}></span>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-secondary hover:text-text-primary">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border-dark flex items-center justify-between text-sm text-text-secondary bg-surface/30">
          <div>Showing 1 to {Math.min(50, filteredSuppliers.length)} of {filteredSuppliers.length} entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border-dark rounded hover:bg-surface disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-border-dark rounded hover:bg-surface">Next</button>
          </div>
        </div>
      </Card>

      {/* Detail Drawer */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={() => setSelectedSupplier(null)}></div>
          <div className="relative w-full max-w-2xl bg-sidebar-bg h-full border-l border-border-dark shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border-dark flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  {selectedSupplier.name}
                  <Badge variant={selectedSupplier.status === 'Active' ? 'success' : 'danger'}>{selectedSupplier.status}</Badge>
                </h2>
                <p className="text-text-secondary mt-1">{selectedSupplier.id} • {selectedSupplier.category} • {selectedSupplier.tier}</p>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface">
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              <Card>
                <CardHeader><CardTitle>Company & Contact Details</CardTitle></CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 p-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-text-secondary font-bold tracking-wider">Office Address</p>
                    <p className="text-sm text-text-primary leading-snug">{selectedSupplier.address || 'Plot No. 42, Sector 18, Gurgaon, HR'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-text-secondary font-bold tracking-wider">GST / Tax ID</p>
                    <p className="text-sm text-text-primary">{selectedSupplier.gst || '06AAAAA0000A1Z5'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-text-secondary font-bold tracking-wider">Primary Contact</p>
                    <p className="text-sm text-text-primary font-medium">{selectedSupplier.contactName || 'Amit Sharma'}</p>
                    <p className="text-xs text-text-secondary">{selectedSupplier.email || 'amit@supplier.com'} • {selectedSupplier.phone || '+91 98765 43210'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-text-secondary font-bold tracking-wider">Payment Terms</p>
                    <p className="text-sm text-text-primary">{selectedSupplier.paymentTerms || 'Net 30'}</p>
                  </div>
                  <div className="space-y-1 col-span-2 pt-2 border-t border-border-dark/50">
                    <p className="text-[10px] uppercase text-text-secondary font-bold tracking-wider">Bank Details</p>
                    <p className="text-sm text-text-primary">A/C: {selectedSupplier.bankAccount || 'XXXXXXXX1234'} • IFSC: {selectedSupplier.ifsc || 'SBIN0001234'}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Scorecard</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border border-border-dark bg-primary flex flex-col items-center justify-center">
                    <span className="text-text-secondary text-sm mb-1">Overall Score</span>
                    <span className="text-2xl font-bold text-text-primary">{selectedSupplier.score}</span>
                  </div>
                  <div className="p-4 rounded-lg border border-border-dark bg-primary flex flex-col items-center justify-center">
                    <span className="text-text-secondary text-sm mb-1">OTD</span>
                    <span className="text-2xl font-bold text-text-primary">{selectedSupplier.otd}%</span>
                  </div>
                  <div className="p-4 rounded-lg border border-border-dark bg-primary flex flex-col items-center justify-center">
                    <span className="text-text-secondary text-sm mb-1">IQC Pass</span>
                    <span className="text-2xl font-bold text-text-primary">{selectedSupplier.iqc}%</span>
                  </div>
                  <div className="p-4 rounded-lg border border-border-dark bg-primary flex flex-col items-center justify-center">
                    <span className="text-text-secondary text-sm mb-1">NCRs YTD</span>
                    <span className="text-2xl font-bold text-text-primary">{selectedSupplier.ncrCount}</span>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Audits</CardTitle>
                </CardHeader>
                <div className="flex flex-wrap gap-4 mb-4">
                  {selectedSupplier.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-border-dark">
                      <Shield className="w-4 h-4 text-success" />
                      <span className="text-sm text-text-primary">{cert}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-text-secondary">Last Audit Score: <span className="text-text-primary font-medium">{selectedSupplier.auditScore}</span></div>
                  <div className="text-text-secondary">Onboarded: <span className="text-text-primary font-medium">{selectedSupplier.onboardingDate}</span></div>
                </div>
              </Card>

              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Recent Purchase Orders</CardTitle>
                  <button className="text-sm text-accent">View All</button>
                </CardHeader>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border-dark bg-primary hover:border-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface rounded-md">
                          <FileText className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">PO-2024-30{selectedSupplier.id.slice(-2)}{i}</div>
                          <div className="text-xs text-text-secondary">Delivery: Oct {15 + i}, 2024</div>
                        </div>
                      </div>
                      <Badge variant={i === 1 ? 'warning' : 'success'}>{i === 1 ? 'Sent' : 'Acknowledged'}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            <div className="p-6 border-t border-border-dark bg-surface flex justify-end gap-3">
              <button className="px-4 py-2 border border-border-dark rounded-md hover:bg-primary transition-colors text-sm">View Full Profile</button>
              <button className="px-4 py-2 bg-accent text-text-primary rounded-md hover:bg-accent/90 transition-colors text-sm">Create PO</button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Onboard Supplier">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Supplier Name</label>
              <input type="text" value={newSup.name} onChange={(e) => setNewSup({...newSup, name: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" placeholder="Enter full legal name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Category</label>
              <select value={newSup.category} onChange={(e) => setNewSup({...newSup, category: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none">
                <option>Raw Materials</option><option>Engine Components</option><option>Body Parts</option><option>Electrical Systems</option><option>Electronics</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">GST / Tax ID</label>
              <input type="text" value={newSup.gst} onChange={(e) => setNewSup({...newSup, gst: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" placeholder="e.g. 06AAAAA..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Office Address</label>
              <textarea value={newSup.address} onChange={(e) => setNewSup({...newSup, address: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none resize-none h-16" placeholder="Enter physical headquarters address"></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-border-dark">
            <h4 className="text-xs font-bold text-accent uppercase mb-3">Primary Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Contact Name</label>
                <input type="text" value={newSup.contactName} onChange={(e) => setNewSup({...newSup, contactName: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" placeholder="Person in charge" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Email ID</label>
                <input type="email" value={newSup.email} onChange={(e) => setNewSup({...newSup, email: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" placeholder="official@company.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Phone Number</label>
                <input type="text" value={newSup.phone} onChange={(e) => setNewSup({...newSup, phone: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" placeholder="+91 ..." />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-dark">
            <h4 className="text-xs font-bold text-accent uppercase mb-3">Commercials & Banking</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Payment Terms</label>
                <select value={newSup.paymentTerms} onChange={(e) => setNewSup({...newSup, paymentTerms: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none">
                  <option>Net 30</option><option>Net 45</option><option>Net 60</option><option>Advance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">IFSC Code</label>
                <input type="text" value={newSup.ifsc} onChange={(e) => setNewSup({...newSup, ifsc: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" placeholder="BANK000..." />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Bank Account Number</label>
                <input type="text" value={newSup.bankAccount} onChange={(e) => setNewSup({...newSup, bankAccount: e.target.value})} className="w-full bg-primary border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary focus:border-accent outline-none" placeholder="Enter official account number" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border-dark sticky bottom-0 bg-surface">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-primary border border-border-dark text-text-secondary rounded hover:text-text-primary transition-colors text-sm">Cancel</button>
            <button onClick={handleOnboard} className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors text-sm font-bold shadow-lg">Confirm Onboarding</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
