import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Book, 
  Ticket, 
  MessageCircle, 
  PlayCircle, 
  ChevronDown, 
  Mail, 
  Phone, 
  Clock, 
  Activity,
  FileText,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const FAQItem = ({ question }: { question: string }) => {
  const [expanded, setExpanded] = React.useState(false)
  return (
    <div className="border-b border-border-dark last:border-none">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{question}</span>
        <ChevronDown size={18} className={cn("text-gray-300 transition-transform", expanded && "rotate-180 text-accent")} />
      </button>
      {expanded && (
        <div className="pb-5 text-xs text-text-secondary leading-relaxed animate-in slide-in-from-top-2 duration-300">
          To initiate a new engineering change order, navigate to the Engineering Change module from the sidebar and click the "+ New ECO" button in the top right. You will need to provide a description, rationale, and select the affected BOM items.
        </div>
      )}
    </div>
  )
}

const HelpCenter = () => {
  const navigate = useNavigate()
  const faqs = [
    'How do I initiate a new engineering change order?',
    'What PPAP levels does the platform support?',
    'How do I connect Teamcenter PDM?',
    'Can I export DVP&R reports to PDF?',
    'How are gate approvals routed?',
    'How do I manage program-level permissions?',
    'Where can I find the latest ISO 26262 compliance templates?',
    'What is the standard SLA for gate approvals?'
  ]

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
        <h1 className="text-4xl font-black text-text-primary tracking-tight">How can we help you today?</h1>
        <p className="text-text-secondary font-medium">Search our documentation, guides, and enterprise support resources.</p>
        <div className="relative mt-8">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search documentation, guides, FAQs..." 
            className="w-full bg-surface border border-border-dark rounded-2xl py-5 pl-14 pr-6 text-sm shadow-xl shadow-navy-900/5 outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Book, title: 'Documentation', desc: 'Browse platform guides and workflow tutorials', color: 'text-accent', path: '/documents' },
          { icon: Ticket, title: 'Submit a Ticket', desc: 'Report a bug or request a feature', color: 'text-blue-600', path: '/notifications' },
          { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with support (Mon-Fri 9am-6pm)', color: 'text-green-600', path: '/notifications' },
          { icon: PlayCircle, title: 'Video Tutorials', desc: 'Watch step-by-step workflow videos', color: 'text-purple-600', path: '/documents' },
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={() => navigate(item.path)}
            className="card p-6 flex flex-col items-center text-center gap-4 group cursor-pointer hover:border-accent transition-all hover:shadow-lg"
          >
            <div className={cn("w-12 h-12 rounded-2xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-border-dark", item.color)}>
              <item.icon size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-text-primary group-hover:text-accent transition-colors">{item.title}</h3>
              <p className="text-[10px] text-text-secondary font-bold leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-black text-text-primary uppercase tracking-widest">Frequently Asked Questions</h2>
            <div className="flex gap-2">
              {['All', 'BOM', 'ECO', 'APQP'].map(f => (
                <span key={f} className="text-[9px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary cursor-pointer">{f}</span>
              ))}
            </div>
          </div>
          <div className="card p-8">
            {faqs.map((q, i) => (
              <FAQItem key={i} question={q} />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="card p-6 space-y-6">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Contact Support</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-accent"><Mail size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Email Support</p>
                  <p className="text-sm font-bold text-text-primary">support@autodev.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-accent"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Call Center</p>
                  <p className="text-sm font-bold text-text-primary">+1 (800) AUTO-DEV</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-accent"><Clock size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Business Hours</p>
                  <p className="text-sm font-bold text-text-primary">Mon - Fri, 9AM - 6PM EST</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-sidebar rounded-xl text-white space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Service Level Agreement</p>
              <p className="text-xs font-medium opacity-80 leading-relaxed">P1 issues responded within 2 hours. P2/P3 within 24 hours.</p>
            </div>
          </div>

          <div className="card p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">System Status</h3>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-[10px] font-bold text-green-600">All Systems Operational</span></div>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Core API', status: '99.9%' },
                { name: 'BOM Hub Service', status: '100%' },
                { name: 'Document Library', status: '99.8%' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center text-xs font-bold">
                  <span className="text-text-secondary">{s.name}</span>
                  <span className="text-text-primary">{s.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 border border-border-dark rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-2">
              Detailed Incident Logs <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter
