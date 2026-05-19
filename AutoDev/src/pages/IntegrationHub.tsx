import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plug, 
  RefreshCw, 
  Settings, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  History,
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const IntegrationCard = ({ integration }: any) => {
  const navigate = useNavigate()
  const statusColor = integration.status === 'Connected' ? 'bg-green-50 text-green-600' : 
                      integration.status === 'Error' ? 'bg-red-50 text-red-600' : 'bg-surface text-text-secondary'
  const dotColor = integration.status === 'Connected' ? 'bg-green-500' : 
                   integration.status === 'Error' ? 'bg-red-500' : 'bg-gray-400'

  return (
    <div className="card p-6 space-y-6 hover:border-accent transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center border border-border-dark shadow-sm">
            <img src={integration.logo} alt={integration.name} className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary group-hover:text-accent transition-colors">{integration.name}</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{integration.vendor}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest", statusColor)}>
          <div className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
          {integration.status}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-text-secondary uppercase tracking-wider">Last Sync</span>
          <span className="text-text-primary">{integration.lastSync}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-text-secondary uppercase tracking-wider">Sync Status</span>
          <span className={cn(
            integration.syncStatus.includes('Success') ? "text-accent" : 
            integration.syncStatus.includes('Error') || integration.syncStatus.includes('Expired') ? "text-red-500" : "text-text-secondary"
          )}>
            {integration.syncStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button 
          onClick={() => navigate('/notifications')}
          className="flex items-center justify-center gap-2 px-3 py-2 border border-border-dark rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-primary hover:text-text-primary transition-all"
        >
          <History size={14} /> Sync Log
        </button>
        <button 
          onClick={() => navigate('/settings/profile')}
          className="flex items-center justify-center gap-2 px-3 py-2 border border-border-dark rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-primary hover:text-text-primary transition-all"
        >
          <Settings size={14} /> Configure
        </button>
      </div>

      {integration.status === 'Error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-[10px] text-red-600 font-bold leading-relaxed mb-2">Authentication token expired. Connection lost at 04:12 AM.</p>
          <button className="w-full py-2 bg-red-500 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">Re-authenticate</button>
        </div>
      )}
    </div>
  )
}

const IntegrationHub = () => {
  const navigate = useNavigate()
  const integrations = [
    { name: 'Teamcenter', vendor: 'Siemens Digital', logo: 'https://cdn.worldvectorlogo.com/logos/siemens-1.svg', status: 'Connected', lastSync: '15m ago', syncStatus: 'Success (42 records)' },
    { name: 'SAP ERP S/4HANA', vendor: 'SAP SE', logo: 'https://cdn.worldvectorlogo.com/logos/sap-1.svg', status: 'Error', lastSync: '8h ago', syncStatus: 'Auth Token Expired' },
    { name: 'JIRA Software', vendor: 'Atlassian', logo: 'https://cdn.worldvectorlogo.com/logos/jira-3.svg', status: 'Connected', lastSync: '2h ago', syncStatus: 'Active WebSocket' },
    { name: 'OneDrive Engineering', vendor: 'Microsoft', logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-onedrive-1.svg', status: 'Connected', lastSync: '1h ago', syncStatus: 'Success (124 files)' },
    { name: 'Slack Alerts', vendor: 'Salesforce', logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', status: 'Disabled', lastSync: 'N/A', syncStatus: 'System Paused' },
    { name: 'Catia V5 Connect', vendor: 'Dassault Systèmes', logo: 'https://cdn.worldvectorlogo.com/logos/dassault-systemes.svg', status: 'Connected', lastSync: '30m ago', syncStatus: 'Success (2 assemblies)' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Integration Hub</h1>
          <p className="text-text-secondary">Manage external system connections and automated data synchronization.</p>
        </div>
        <button 
          onClick={() => navigate('/settings/profile')}
          className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
        >
          <Plus size={20} /> New Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item, i) => (
          <IntegrationCard key={i} integration={item} />
        ))}
        
        <div 
          onClick={() => navigate('/settings/profile')}
          className="card border-2 border-dashed border-border-dark flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-primary/50 transition-all opacity-60"
        >
           <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-gray-300 mb-4 group-hover:scale-110 transition-transform">
             <Plug size={24} />
           </div>
           <h3 className="text-sm font-black text-text-secondary uppercase tracking-widest mb-1">Add Marketplace Integration</h3>
           <p className="text-[10px] text-gray-300 font-bold max-w-[160px]">Browse 40+ pre-built automotive engineering connectors</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-border-dark flex justify-between items-center bg-primary/20">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-accent" />
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Global Sync Health</h3>
          </div>
          <button 
            onClick={() => navigate('/notifications')}
            className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
          >
            Detailed Logs <ArrowRight size={14} />
          </button>
        </div>
        <div className="p-8 grid grid-cols-4 gap-8">
          {[
            { label: 'Uptime', value: '99.98%', sub: 'Last 30 Days' },
            { label: 'Total Syncs', value: '12,402', sub: 'Today' },
            { label: 'Avg Latency', value: '142ms', sub: 'Enterprise-wide' },
            { label: 'Errors Found', value: '02', sub: 'Requiring Attention', color: 'text-red-500' },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{stat.label}</p>
              <p className={cn("text-2xl font-black", stat.color || "text-text-primary")}>{stat.value}</p>
              <p className="text-[9px] text-text-secondary font-bold uppercase">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IntegrationHub
