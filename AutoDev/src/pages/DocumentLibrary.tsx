import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  MoreVertical, 
  LayoutGrid, 
  List,
  Eye,
  Archive,
  Trash2,
  FileCode,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DocumentCard = ({ doc }: any) => {
  const navigate = useNavigate()
  const Icon = doc.type === 'PDF' ? FileText : doc.type === 'XLSX' ? FileSpreadsheet : FileCode
  
  return (
    <div className="card group hover:border-accent transition-all cursor-pointer flex flex-col h-full" onClick={() => navigate('/notifications')}>
      <div className="p-4 border-b border-border-dark flex justify-between items-center bg-primary/30">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[10px]",
            doc.type === 'PDF' ? "bg-red-500" : doc.type === 'XLSX' ? "bg-green-600" : "bg-accent"
          )}>
            {doc.type}
          </div>
          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{doc.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-text-secondary">V.{doc.version}</span>
          <button className="text-gray-300 hover:text-text-primary transition-colors"><MoreVertical size={14} /></button>
        </div>
      </div>
      
      <div className="p-6 flex-1 space-y-4">
        <div className="h-32 bg-primary rounded-lg flex items-center justify-center relative overflow-hidden border border-border-dark/50">
          <Icon size={48} className="text-gray-200 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
             <button className="p-2 bg-surface rounded-full shadow-lg text-accent hover:bg-accent hover:text-white transition-all"><Eye size={18} /></button>
             <button className="p-2 bg-surface rounded-full shadow-lg text-accent hover:bg-accent hover:text-white transition-all"><Download size={18} /></button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-1">{doc.name}</h3>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">{doc.category}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-surface flex items-center justify-center text-[8px] font-black">{doc.owner.split(' ').map((n:any) => n[0]).join('')}</div>
            <span className="text-[10px] text-text-secondary font-bold">{doc.owner}</span>
          </div>
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
            doc.status === 'PUBLISHED' ? "bg-teal-50 text-accent" : 
            doc.status === 'UNDER REVIEW' ? "bg-amber-50 text-amber-600" : "bg-surface text-text-secondary"
          )}>
            {doc.status}
          </span>
        </div>
      </div>

      <div className="p-4 bg-primary/50 border-t border-border-dark flex justify-between items-center">
        <span className="text-[9px] font-bold text-text-secondary uppercase">{doc.date}</span>
        <div className="flex gap-4">
          <button className="text-[9px] font-black text-text-secondary hover:text-accent uppercase tracking-widest flex items-center gap-1"><Share2 size={12} /> Share</button>
          <button className="text-[9px] font-black text-text-secondary hover:text-accent uppercase tracking-widest flex items-center gap-1"><Eye size={12} /> View</button>
        </div>
      </div>
    </div>
  )
}

const DocumentLibrary = () => {
  const documents = [
    { id: 'DOC-9042', name: 'Alpha_SUV_Design_Verification_Spec', type: 'PDF', version: '2.1', category: 'Engineering Spec', owner: 'Alex Rivera', status: 'PUBLISHED', date: 'May 10, 2024' },
    { id: 'DOC-8821', name: 'Battery_Thermal_Testing_Matrix', type: 'XLSX', version: '1.4', category: 'Validation', owner: 'Sarah Jenkins', status: 'UNDER REVIEW', date: 'May 12, 2024' },
    { id: 'DOC-7710', name: 'BIW_Material_Safety_Data_Sheet', type: 'PDF', version: '4.0', category: 'Safety/Compliance', owner: 'Michael Chen', status: 'PUBLISHED', date: 'May 08, 2024' },
    { id: 'DOC-6604', name: 'Powertrain_Control_Logic_C-Code', type: 'CODE', version: '0.8', category: 'Software', owner: 'Elena Vance', status: 'ARCHIVED', date: 'Apr 24, 2024' },
    { id: 'DOC-5501', name: 'Supplier_Quality_Manual_2024', type: 'PDF', version: '1.0', category: 'Quality', owner: 'David Miller', status: 'PUBLISHED', date: 'May 14, 2024' },
    { id: 'DOC-4492', name: 'Interior_Lighting_Ergonomics_Study', type: 'PDF', version: '2.2', category: 'Design', owner: 'Sarah Jenkins', status: 'UNDER REVIEW', date: 'May 13, 2024' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Technical Document Library</h1>
          <p className="text-text-secondary">Search and manage platform-wide engineering documentation and specifications.</p>
        </div>
        <button className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20">
          <Download size={20} /> Bulk Export
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by Document Title, Part Number, or ID..." 
            className="w-full bg-surface border border-border-dark rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-surface border border-border-dark rounded-xl px-4 py-3.5 text-sm font-bold text-text-primary outline-none focus:border-accent shadow-sm cursor-pointer min-w-[160px]">
            <option>Document Type</option>
            <option>PDF</option>
            <option>XLSX</option>
            <option>Code</option>
          </select>
          <select className="bg-surface border border-border-dark rounded-xl px-4 py-3.5 text-sm font-bold text-text-primary outline-none focus:border-accent shadow-sm cursor-pointer min-w-[160px]">
            <option>Status</option>
            <option>Published</option>
            <option>Under Review</option>
            <option>Archived</option>
          </select>
          <div className="flex border border-border-dark rounded-xl overflow-hidden shadow-sm bg-surface p-1">
            <button className="p-2.5 bg-surface text-text-primary rounded-lg"><LayoutGrid size={18} /></button>
            <button className="p-2.5 bg-surface text-text-secondary hover:text-text-primary transition-colors"><List size={18} /></button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Showing 124 documents</span>
        <div className="flex items-center gap-2 text-xs font-bold text-accent cursor-pointer hover:underline">
          More Filters <ChevronDown size={14} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  )
}

export default DocumentLibrary
