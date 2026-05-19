import { useState } from 'react'
import { HelpCircle, Book, ChevronDown, ChevronUp, Search, Send, CheckCircle, ExternalLink, Zap, ShieldCheck, Wrench, Activity } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'

const DOCS = [
  { icon: Activity, title: 'Operations Dashboard Guide', desc: 'Understanding KPIs, live line status, and Andon events.', tag: 'Operations' },
  { icon: Zap, title: 'Andon Event Management', desc: 'How to raise, acknowledge, and resolve Andon events with SLA tracking.', tag: 'Operations' },
  { icon: Wrench, title: 'Maintenance & Breakdown Workflow', desc: 'Logging breakdowns, assigning technicians, and managing spare parts.', tag: 'Maintenance' },
  { icon: ShieldCheck, title: 'Quality Gate & NCR Process', desc: 'Quality inspections, defect logging, scrap/rework disposition flows.', tag: 'Quality' },
  { icon: Book, title: 'Work Order Lifecycle', desc: 'Creating, releasing, tracking, and closing work orders end-to-end.', tag: 'Planning' },
  { icon: HelpCircle, title: 'User & Role Management', desc: 'Adding users, assigning roles, and managing plant access permissions.', tag: 'Admin' },
]

const FAQS = [
  { q: 'How do I raise an Andon event?', a: 'Navigate to Operations → Andon Mgmt and click "Log Manual Event". Fill in the title, type, priority, and description, then click "Raise Andon". The event will appear in the live list with an SLA countdown timer.' },
  { q: 'Why is the dashboard showing "Simulation Mode"?', a: 'The app is running in frontend-only demo mode. All data is simulated using realistic mock data. The WebSocket live feed simulates real-time updates every 5 seconds. All CRUD actions persist for the current browser session.' },
  { q: 'How do I change a Work Order status?', a: 'Go to Operations → Work Orders. Find the WO row and click the status button in the Actions column (Release → Start → Complete). You can also select multiple WOs and use bulk actions at the top.' },
  { q: 'How do I log a machine breakdown?', a: 'Go to Maintenance → Breakdowns and click "Log Breakdown". Fill in the machine details, fault description, and priority. A ticket is created immediately and the affected line status is updated.' },
  { q: 'Can I add new users to the system?', a: 'Yes. Go to Admin → Users and click "Add User". Fill in name, email, role, and badge ID. The user will appear in the list and can be activated/deactivated with the toggle button.' },
  { q: 'How do I adjust spare parts inventory?', a: 'Go to Maintenance → Spare Parts. Click the "Adjust" button on any part row. Use the +/- buttons to set the adjustment quantity, then click "Confirm". The stock level and status (OK/Reorder/Stockout) update automatically.' },
  { q: 'What does SLA Breached mean on an Andon event?', a: 'SLA (Service Level Agreement) means the event has exceeded its resolution time limit. Critical events have a 60-minute SLA, High has 20 minutes. Breached events show a red border and "SLA BREACHED" badge.' },
]

const STATUS_ITEMS = [
  { name: 'Operations Dashboard', status: 'operational', uptime: '99.98%' },
  { name: 'Andon Alert System', status: 'operational', uptime: '99.95%' },
  { name: 'Work Order Engine', status: 'operational', uptime: '100%' },
  { name: 'Quality Gate Module', status: 'operational', uptime: '99.91%' },
  { name: 'Maintenance Tracking', status: 'degraded', uptime: '97.2%' },
  { name: 'Live WebSocket Feed', status: 'operational', uptime: '99.87%' },
]

const STATUS_CFG = {
  operational: { label: 'Operational', dot: 'bg-green-500', text: 'text-green-600' },
  degraded:    { label: 'Degraded',    dot: 'bg-yellow-400', text: 'text-yellow-600' },
  outage:      { label: 'Outage',      dot: 'bg-red-500',   text: 'text-red-600' },
}

export function HelpSupportPage() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [ticket, setTicket] = useState({ subject: '', category: 'Operations', priority: 'medium', description: '' })

  const filteredFaqs = FAQS.filter(f =>
    !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )
  const filteredDocs = DOCS.filter(d =>
    !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.tag.toLowerCase().includes(search.toLowerCase())
  )

  const submitTicket = () => {
    if (!ticket.subject || !ticket.description) { toast('Subject and description are required', 'error'); return }
    setSubmitted(true)
    toast(`Support ticket #SUP-${Math.floor(1000 + Math.random() * 9000)} submitted`, 'success')
  }

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto scrollbar-hide pb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-heading-xl flex items-center gap-3"><HelpCircle size={24} className="text-forest-600"/> Help & Support Center</h1>
          <p className="text-body text-text-secondary">Documentation, FAQs, system status, and ticket submission</p>
        </div>
      </div>

      {/* Search */}
      <Input
        className="w-full"
        placeholder="Search documentation and FAQs..."
        iconLeft={<Search size={18}/>}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT: Docs + FAQs */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Documentation Library */}
          <Card className="p-5">
            <h2 className="text-heading-sm mb-4 flex items-center gap-2"><Book size={16}/> Documentation Library</h2>
            <div className="grid grid-cols-2 gap-3">
              {filteredDocs.map(doc => (
                <button key={doc.title}
                  onClick={() => toast(`Opening: ${doc.title}`, 'info')}
                  className="text-left p-4 rounded-lg border border-border hover:border-forest-400 hover:bg-forest-50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-600 flex items-center justify-center flex-shrink-0 group-hover:bg-forest-200 transition-colors">
                      <doc.icon size={16}/>
                    </div>
                    <div>
                      <div className="font-medium text-body-sm flex items-center gap-1">
                        {doc.title} <ExternalLink size={11} className="text-text-muted"/>
                      </div>
                      <div className="text-body-xs text-text-muted mt-0.5">{doc.desc}</div>
                      <span className="inline-block mt-2 text-label px-2 py-0.5 rounded bg-forest-100 text-forest-700">{doc.tag}</span>
                    </div>
                  </div>
                </button>
              ))}
              {filteredDocs.length === 0 && <p className="text-body-sm text-text-muted col-span-2 text-center py-4">No documentation matches your search.</p>}
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-5">
            <h2 className="text-heading-sm mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-surface transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-body-sm">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-text-muted flex-shrink-0"/> : <ChevronDown size={16} className="text-text-muted flex-shrink-0"/>}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-body-sm text-text-secondary border-t border-border pt-3 bg-surface/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length === 0 && <p className="text-body-sm text-text-muted text-center py-4">No FAQs match your search.</p>}
            </div>
          </Card>
        </div>

        {/* RIGHT: Status + Ticket Form */}
        <div className="flex flex-col gap-5">
          {/* Platform Status */}
          <Card className="p-5">
            <h2 className="text-heading-sm mb-4">Platform Status</h2>
            <div className="space-y-3">
              {STATUS_ITEMS.map(item => {
                const cfg = STATUS_CFG[item.status as keyof typeof STATUS_CFG]
                return (
                  <div key={item.name} className="flex items-center justify-between text-body-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}/>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</div>
                      <div className="text-body-xs text-text-muted">{item.uptime}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border text-body-xs text-text-muted">
              Last checked: {new Date().toLocaleTimeString()}
            </div>
          </Card>

          {/* Submit Ticket */}
          <Card className="p-5">
            <h2 className="text-heading-sm mb-4 flex items-center gap-2"><Send size={15}/> Submit Support Ticket</h2>
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3"/>
                <h3 className="font-semibold text-body mb-1">Ticket Submitted!</h3>
                <p className="text-body-sm text-text-secondary mb-4">Our support team will respond within 4 business hours.</p>
                <Button variant="outline" onClick={() => { setSubmitted(false); setTicket({ subject: '', category: 'Operations', priority: 'medium', description: '' }) }}>
                  Submit Another
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-body-sm font-medium mb-1">Subject *</label>
                  <Input value={ticket.subject} onChange={e => setTicket(t => ({...t, subject: e.target.value}))} placeholder="Brief issue summary"/>
                </div>
                <div>
                  <label className="block text-body-sm font-medium mb-1">Module</label>
                  <Select value={ticket.category} onChange={e => setTicket(t => ({...t, category: e.target.value}))}
                    options={['Operations','Maintenance','Quality','Planning','Admin','Other'].map(v => ({label:v,value:v}))}/>
                </div>
                <div>
                  <label className="block text-body-sm font-medium mb-1">Priority</label>
                  <Select value={ticket.priority} onChange={e => setTicket(t => ({...t, priority: e.target.value}))}
                    options={[{label:'Low',value:'low'},{label:'Medium',value:'medium'},{label:'High',value:'high'},{label:'Critical',value:'critical'}]}/>
                </div>
                <div>
                  <label className="block text-body-sm font-medium mb-1">Description *</label>
                  <Textarea rows={4} value={ticket.description} onChange={e => setTicket(t => ({...t, description: e.target.value}))} placeholder="Describe the issue in detail..."/>
                </div>
                <Button variant="primary" className="w-full" iconLeft={<Send size={14}/>} onClick={submitTicket}>
                  Submit Ticket
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
