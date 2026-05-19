import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronDown, 
  ChevronRight, 
  Package, 
  Settings, 
  Cpu, 
  FileText,
  Search,
  Filter,
  Download,
  GitCompare,
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
  Send,
} from 'lucide-react'
import { cn } from '../utils/cn'

import { Modal } from '../components/Modal'
import { useEventBus } from '../stores/eventBus'
import { useAuthStore } from '../stores/authStore'
import { can } from '../lib/permissions'
import { recordAudit } from '../lib/audit'

const BOMNode = ({ node, level = 0 }: any) => {
  const [expanded, setExpanded] = React.useState(level === 0)
  const Icon = node.type === 'vehicle' ? Package : 
               node.type === 'assembly' ? Settings : 
               node.type === 'part' ? Cpu : FileText

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center py-2 px-3 gap-2 cursor-pointer transition-colors group",
          level === 0 ? "text-text-primary font-bold" : "text-text-secondary",
          "hover:bg-surface/50 rounded-lg"
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 flex-1">
          {node.children ? (
            expanded ? <ChevronDown size={14} className="text-text-secondary" /> : <ChevronRight size={14} className="text-text-secondary" />
          ) : <div className="w-3.5" />}
          <Icon size={16} className={cn(level === 0 ? "text-accent" : "text-text-secondary")} />
          <span className="text-xs truncate">{node.name}</span>
        </div>
        {node.version && (
          <span className="text-[9px] font-black bg-surface text-text-secondary px-1.5 py-0.5 rounded group-hover:bg-teal-50 group-hover:text-accent transition-colors">
            {node.version}
          </span>
        )}
      </div>
      {expanded && node.children?.map((child: any, i: number) => (
        <BOMNode key={i} node={child} level={level + 1} />
      ))}
    </div>
  )
}

const BOMHub = () => {
  const navigate = useNavigate()
  
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedPart, setSelectedPart] = React.useState<any>(null)
  const [treeFilter, setTreeFilter] = React.useState('')

  const bomData = {
    name: 'Alpha SUV Platform',
    type: 'vehicle',
    version: 'V.4',
    children: [
      { 
        name: 'Powertrain System', 
        type: 'assembly', 
        version: 'V.2',
        children: [
          { name: 'Battery Enclosure', type: 'assembly', version: 'V.8', children: [
            { name: 'Upper Housing', type: 'part', version: 'A.1' },
            { name: 'Lower Housing', type: 'part', version: 'A.2' },
            { name: 'M6 Seal Fastener', type: 'fastener', version: 'V.1' },
          ]},
          { name: 'Electric Motor Assembly', type: 'assembly', version: 'V.4' },
          { name: 'Inverter Unit', type: 'part', version: 'V.1' },
        ]
      },
      { 
        name: 'Chassis & Suspension', 
        type: 'assembly', 
        version: 'V.5',
        children: [
          { name: 'Front Subframe', type: 'part', version: 'B.2' },
          { name: 'Rear Multi-link', type: 'part', version: 'A.4' },
        ]
      },
      { name: 'Body-in-White (BIW)', type: 'assembly', version: 'V.1' },
    ]
  }

  const parts = [
    { id: 'PART-0012', desc: 'Battery Upper Housing', mat: 'AL-6061-T6', weight: 4.2, cost: 125.00, status: 'Released' },
    { id: 'PART-0013', desc: 'Battery Lower Housing', mat: 'AL-6061-T6', weight: 6.8, cost: 180.00, status: 'In Review' },
    { id: 'PART-0014', desc: 'Gasket Seal R-90', mat: 'EPDM Rubber', weight: 0.12, cost: 12.50, status: 'Released' },
    { id: 'FAST-0842', desc: 'M6 Hex Bolt Flanged', mat: 'Steel Grade 10.9', weight: 0.02, cost: 0.45, status: 'Released' },
    { id: 'PART-0088', desc: 'Thermal Pad Interface', mat: 'Silicone/Graphite', weight: 0.45, cost: 45.00, status: 'Draft' },
    { id: 'PART-0089', desc: 'Thermal Management Fluid', mat: 'Coolant', weight: 2.5, cost: 35.00, status: 'Released' },
    { id: 'PART-0120', desc: 'Inverter Base Plate', mat: 'AL-ADC12', weight: 3.1, cost: 85.00, status: 'In Review' },
    { id: 'FAST-0843', desc: 'M8 Hex Bolt Flanged', mat: 'Steel Grade 10.9', weight: 0.04, cost: 0.65, status: 'Released' },
    { id: 'PART-0133', desc: 'High Voltage Connector', mat: 'Copper/Nylon', weight: 0.8, cost: 110.00, status: 'Released' },
    { id: 'PART-0145', desc: 'Busbar Link', mat: 'Copper Grade 1', weight: 1.2, cost: 65.00, status: 'Draft' },
    { id: 'PART-0150', desc: 'Motor Housing', mat: 'AL-A380', weight: 12.5, cost: 240.00, status: 'Released' },
    { id: 'PART-0155', desc: 'Stator Core Assembly', mat: 'Silicon Steel/Copper', weight: 18.0, cost: 450.00, status: 'In Review' },
    { id: 'PART-0162', desc: 'Rotor Assembly', mat: 'Steel/Neodymium', weight: 14.5, cost: 580.00, status: 'Released' },
    { id: 'FAST-0850', desc: 'Retaining Ring', mat: 'Spring Steel', weight: 0.01, cost: 0.25, status: 'Released' },
    { id: 'PART-0180', desc: 'Cooling Jacket', mat: 'AL-6061-T6', weight: 5.4, cost: 145.00, status: 'Released' },
  ]

  const filteredParts = parts.filter(part => 
    part.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const emit = useEventBus((s) => s.emit)
  const role = useAuthStore((s) => s.user?.role)
  const userId = useAuthStore((s) => s.user?.id ?? 'unknown')
  const canRelease = can(role, 'RELEASE_DESIGN_FREEZE')

  const [isComparing, setIsComparing] = React.useState(false)
  const [releaseMbomId, setReleaseMbomId] = React.useState<string | null>(null)

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Part Number,Description,Material,Weight (kg),Est. Cost,Status\n"
      + filteredParts.map(p => `${p.id},"${p.desc}","${p.mat}",${p.weight},${p.cost},${p.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bom_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleCompare = () => setIsComparing(true)

  const handleReleaseMbom = () => {
    const partNumbers = parts.filter((p) => p.status !== 'Draft').map((p) => p.id)
    const mbomId = `MBOM-${Date.now().toString(36).toUpperCase()}`
    emit({
      type: 'bom.released',
      programId: 'PRG-ALPHA',
      mbomId,
      partNumbers,
    })
    recordAudit({
      entity: 'BOM',
      entityId: mbomId,
      action: 'RELEASE_MBOM',
      userId,
      after: { partCount: partNumbers.length },
    })
    setReleaseMbomId(mbomId)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase mb-1">
            Project Alpha <ChevronRight size={12} /> BOM Explorer
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Product Structure</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCompare}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:text-text-primary transition-all"
          >
            <GitCompare size={18} /> Compare Versions
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:text-text-primary transition-all"
          >
            <Download size={18} /> Export
          </button>
          <button
            onClick={handleReleaseMbom}
            title="Release MBOM to Production Planning"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-accent text-white shadow-lg shadow-teal-500/20 hover:bg-accent/90"
          >
            <Send size={18} /> Release MBOM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Navigation Tree */}
        <div className="lg:col-span-1 card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border-dark">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Filter tree..." 
                value={treeFilter}
                onChange={(e) => setTreeFilter(e.target.value)}
                className="w-full bg-primary border border-border-dark rounded-md py-1.5 pl-9 pr-3 text-xs outline-none focus:border-accent" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <BOMNode node={bomData} />
          </div>
        </div>

        {/* Detail Table */}
        <div className="lg:col-span-3 card flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border-dark flex justify-between items-center bg-primary/50">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-text-primary">Battery Enclosure Details</h2>
              <span className="px-2 py-0.5 bg-sidebar text-white text-[10px] font-bold rounded-full">12 Parts</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-surface border border-border-dark rounded text-accent"><LayoutGrid size={16} /></button>
              <button className="p-2 bg-surface border border-border-dark rounded text-text-secondary"><ListIcon size={16} /></button>
              <button className="p-2 bg-surface border border-border-dark rounded text-text-secondary ml-2"><MoreVertical size={16} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface shadow-sm z-10">
                <tr className="border-b border-border-dark">
                  <th className="px-6 py-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Part Number</th>
                  <th className="px-6 py-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Material</th>
                  <th className="px-6 py-4 text-[10px] font-black text-text-secondary uppercase tracking-widest text-right">Weight (kg)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-text-secondary uppercase tracking-widest text-right">Est. Cost</th>
                  <th className="px-6 py-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredParts.map((part, i) => (
                  <tr 
                    key={i} 
                    className={cn(
                      "hover:bg-teal-50/30 transition-colors cursor-pointer group",
                      selectedPart?.id === part.id && "bg-teal-50"
                    )}
                    onClick={() => setSelectedPart(part)}
                  >
                    <td className="px-6 py-4 text-xs font-black text-text-primary group-hover:text-accent">{part.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-text-secondary">{part.desc}</td>
                    <td className="px-6 py-4 text-xs text-text-secondary">{part.mat}</td>
                    <td className="px-6 py-4 text-xs font-bold text-text-primary text-right">{part.weight.toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs font-bold text-text-primary text-right">${part.cost.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter",
                        part.status === 'Released' ? "bg-teal-50 text-accent" :
                        part.status === 'In Review' ? "bg-amber-50 text-amber-600" : "bg-surface text-text-secondary"
                      )}>
                        <div className={cn("w-1 h-1 rounded-full", 
                          part.status === 'Released' ? "bg-accent/90" : 
                          part.status === 'In Review' ? "bg-amber-600" : "bg-gray-400"
                        )} />
                        {part.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary/50 border-t border-border-dark font-bold">
                  <td colSpan={3} className="px-6 py-4 text-[10px] text-text-secondary uppercase tracking-widest">Sub-Assembly Totals</td>
                  <td className="px-6 py-4 text-sm text-text-primary text-right">11.59 kg</td>
                  <td className="px-6 py-4 text-sm text-text-primary text-right">$362.95</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <Modal
        isOpen={!!selectedPart}
        onClose={() => setSelectedPart(null)}
        title={`Part Detail: ${selectedPart?.id}`}
        footer={(
          <button 
            onClick={() => navigate('/engineering-change')}
            className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-teal-500/20"
          >
            Create ECO
          </button>
        )}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Description</label>
              <p className="text-sm font-bold text-text-primary">{selectedPart?.desc}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Status</label>
              <p className="text-sm font-bold text-accent">{selectedPart?.status}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Material</label>
              <p className="text-sm font-bold text-text-primary">{selectedPart?.mat}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Weight</label>
              <p className="text-sm font-bold text-text-primary">{selectedPart?.weight} kg</p>
            </div>
          </div>
          <div className="p-4 bg-primary rounded-lg border border-border-dark">
            <h4 className="text-xs font-bold text-text-primary mb-2">Recent Changes</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-text-secondary">ECO-4092: Material Update</span>
                <span className="font-bold">2 days ago</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-text-secondary">REV-02: Initial Release</span>
                <span className="font-bold">1 month ago</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isComparing}
        onClose={() => setIsComparing(false)}
        title="Compare BOM Versions: V.4 vs V.3"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Reviewing changes between the current working version (V.4) and the previously released version (V.3).</p>
          
          <table className="w-full text-left border-collapse mt-4">
            <thead>
              <tr className="border-b border-border-dark bg-surface">
                <th className="px-4 py-2 text-[10px] font-black text-text-secondary uppercase">Part Number</th>
                <th className="px-4 py-2 text-[10px] font-black text-text-secondary uppercase">Change Type</th>
                <th className="px-4 py-2 text-[10px] font-black text-text-secondary uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              <tr className="bg-amber-50/50">
                <td className="px-4 py-3 text-xs font-bold text-text-primary">PART-0013</td>
                <td className="px-4 py-3 text-xs font-bold text-amber-600">MODIFIED</td>
                <td className="px-4 py-3 text-xs text-text-secondary">Material changed from AL-6061-T4 to AL-6061-T6. Weight increased by 0.2kg.</td>
              </tr>
              <tr className="bg-teal-50/50">
                <td className="px-4 py-3 text-xs font-bold text-text-primary">PART-0088</td>
                <td className="px-4 py-3 text-xs font-bold text-accent">ADDED</td>
                <td className="px-4 py-3 text-xs text-text-secondary">New thermal pad interface added to battery enclosure.</td>
              </tr>
              <tr className="bg-red-50/50">
                <td className="px-4 py-3 text-xs font-bold text-text-primary">FAST-0840</td>
                <td className="px-4 py-3 text-xs font-bold text-red-600">REMOVED</td>
                <td className="px-4 py-3 text-xs text-text-secondary">Replaced by FAST-0842 (M6 Hex Bolt Flanged).</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <button 
              onClick={() => setIsComparing(false)}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent/90"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!releaseMbomId}
        onClose={() => setReleaseMbomId(null)}
        title="MBOM Released"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-accent mb-2">
              <Send size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-primary">Successfully released MBOM</h3>
            <p className="text-sm text-text-secondary">
              The Manufacturing Bill of Materials has been published to production planning.
            </p>
            <div className="bg-surface border border-border-dark px-4 py-2 rounded-lg mt-4 w-full">
              <p className="text-xs font-black text-text-secondary uppercase tracking-widest mb-1">MBOM ID</p>
              <p className="text-lg font-bold text-accent">{releaseMbomId}</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => setReleaseMbomId(null)}
              className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-accent/90 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BOMHub
