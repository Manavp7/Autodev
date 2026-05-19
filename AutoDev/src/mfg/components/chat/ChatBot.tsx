import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Message {
  id: string
  role: 'bot' | 'user'
  content: string
  timestamp: Date
}

const KB = {
  greet:      ["hello", "hi", "hey", "good morning"],
  oee:        ["oee", "efficiency", "overall equipment", "performance"],
  andon:      ["andon", "line stop", "breakdown", "fault", "stopped"],
  workorder:  ["work order", "wo", "production order", "schedule"],
  quality:    ["quality", "defect", "scrap", "rework", "eol", "test"],
  maintenance:["maintenance", "breakdown", "repair", "mtbf", "spare parts", "tooling"],
  shift:      ["shift", "handover", "changeover", "operator"],
  planning:   ["plan", "planning", "schedule", "takt", "target"],
  traceability:["vin", "trace", "traceability", "serial", "vehicle"],
  reports:    ["report", "analytics", "export", "csv", "download"],
  help:       ["help", "what can you do", "features"],
}

const RESPONSES: Record<string, string> = {
  greet: "👋 Hi! I'm the **AutoMFG AI Assistant**. Ask me about:\n• Line status & OEE\n• Andon alerts & breakdowns\n• Work orders & planning\n• Quality & traceability\n• Maintenance & spare parts\n• Shift handover\n• Reports & exports",
  oee: "📊 **OEE Dashboard:**\n• Real-time OEE per line is on the Operations Dashboard\n• Target: **85%** across all lines\n• OEE = Availability x Performance x Quality\n• Drill into OEE Analytics page for trend charts and loss waterfall\n\n💡 *Tip: Lines below 80% OEE are highlighted in orange in the line status grid.*",
  andon: "🚨 **Andon Management:**\n• Raised andons appear in the Live Andon Feed on the dashboard\n• Priority levels: P1 (Line Stop) -> P4 (Info)\n• Click any andon event to see escalation chain and resolution status\n• P1/P2 events trigger automatic notifications to Shift Lead\n\n⚡ *Resolve an andon: Open the event -> click 'Resolve' -> enter root cause.*",
  workorder: "📋 **Work Orders:**\n• Active WOs shown on Operations Dashboard and Work Order Management page\n• Filter by: Line, Shift, Status (Open/Running/Complete/Hold)\n• Takt Time page shows real-time cycle time vs. target per station\n• Export full WO list as CSV from the Work Orders page\n\n💡 *Click any WO ID to open its detail drawer with full history.*",
  quality: "🛡️ **Quality:**\n• **Production Quality Gate** - inline inspection at end of assembly\n• **Scrap/Rework** - log defects with disposition (Scrap/Rework/UAI)\n• **EOL Testing** - end-of-line test results per VIN\n• **VIN Traceability** - full build record per vehicle\n\n📊 *Quality defect Pareto charts available in Reports & Analytics.*",
  maintenance: "🔧 **Maintenance:**\n• **Machine Breakdowns** - log, assign technician, track resolution\n• **Tooling & Equipment** - tool life tracking, replacement alerts\n• **Machine Registry** - full machine master with specs\n• **Spare Parts Inventory** - stock levels with min/max alerts\n\n⚙️ *MTBF and MTTR metrics per machine are in OEE Analytics.*",
  shift: "🔄 **Shift Handover:**\n• Structured handover report: production summary, open andons, pending WOs, safety incidents\n• Go to Shift Handover page to create or review reports\n• Previous shift reports are archived and searchable\n\n📝 *Both outgoing and incoming shift leads must acknowledge the handover.*",
  planning: "📅 **Production Planning:**\n• Planning page shows the production schedule by line and shift\n• Takt Time page monitors real vs. target cycle time live\n• Alerts are raised automatically when actual takt exceeds target by >10%",
  traceability: "🔍 **VIN Traceability:**\n• Enter any VIN on the VIN Traceability page\n• Returns: full build sequence, WO history, operator stamps, quality gate results, EOL test record\n• Supports regulatory audit export (PDF)",
  reports: "📥 **Reports & Analytics:**\n• Go to Reports & Analytics for:\n  - Daily/Weekly/Monthly production summaries\n  - OEE trend by line\n  - Quality defect Pareto\n  - Maintenance downtime analysis\n• All reports export to CSV or PDF via the Export button",
  help: "ðŸ¤– **AutoMFG AI - Commands:**\n\n| Ask about | Response covers |\n|---|---|\n| `OEE` | Efficiency metrics |\n| `andon` | Line stops & escalation |\n| `work order` | WO status & takt |\n| `quality` | Defects, scrap, EOL |\n| `maintenance` | Breakdowns & spare parts |\n| `shift` | Handover reports |\n| `VIN trace` | Vehicle traceability |\n| `reports` | Export & analytics |",
  fallback: "🤔 I'm not sure about that. I can help with:\n• **OEE** and line performance\n• **Andon** alerts and breakdowns\n• **Work order** status\n• **Quality** - scrap/rework/EOL\n• **Maintenance** and spare parts\n• **Shift handover**\n• **Reports** and exports\n\nTry asking about one of these topics!"
}

const parseMessage = (text: string) => {
  const parts = text.split('\n')
  return parts.map((part, i) => {
    if (part.startsWith('•')) {
      return <li key={i} className="ml-4 list-disc">{part.replace('• ', '')}</li>
    }
    if (part.includes('|---|---|')) return null // Basic markdown table strip
    if (part.startsWith('|')) {
      const cells = part.split('|').filter(Boolean)
      return (
        <div key={i} className="flex border-b border-border-dark py-1 text-xs">
          <div className="flex-1 font-bold">{cells[0].trim()}</div>
          <div className="flex-2">{cells[1]?.trim()}</div>
        </div>
      )
    }
    const htmlPart = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
    return <p key={i} dangerouslySetInnerHTML={{ __html: htmlPart }} className="mb-2 last:mb-0" />
  })
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', content: RESPONSES.greet, timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isMinimized, isTyping])

  const handleSend = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let matchedKey = 'fallback'
      const lowerInput = text.toLowerCase()

      for (const [key, keywords] of Object.entries(KB)) {
        if (keywords.some(k => lowerInput.includes(k))) {
          matchedKey = key
          break
        }
      }

      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', content: RESPONSES[matchedKey], timestamp: new Date() }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white shadow-[0_0_25px_rgba(46,125,50,0.4)] hover:scale-110 transition-transform z-50 group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger border-2 border-surface text-white text-[9px] font-bold rounded-full flex items-center justify-center">AI</span>
      </button>
    )
  }

  return (
    <div className={cn(
      "fixed right-6 bottom-6 w-96 bg-surface border border-border-dark shadow-2xl flex flex-col transition-all duration-300 z-50 rounded-2xl overflow-hidden",
      isMinimized ? "h-14" : "h-[600px] max-h-[80vh]"
    )}>
      {/* Header */}
      <div className="h-14 bg-primary/80 backdrop-blur border-b border-border-dark flex items-center justify-between px-4 shrink-0 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">AutoMFG AI</h3>
            <p className="text-[10px] text-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }} className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded-md">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false) }} className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-md">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'user' ? "bg-surface border border-border-dark text-text-primary" : "bg-accent/10 border border-accent/20 text-accent"
                )}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm",
                  msg.role === 'user' 
                    ? "bg-accent text-white rounded-tr-sm" 
                    : "bg-primary border border-border-dark text-text-primary rounded-tl-sm"
                )}>
                  {parseMessage(msg.content)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-2xl rounded-tl-sm bg-primary border border-border-dark flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-primary border-t border-border-dark flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
            {['OEE Status', 'Active Andons', 'Open WOs', 'Shift Handover', 'Reports'].map(chip => (
              <button 
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-3 py-1 rounded-full bg-surface border border-border-dark text-[11px] font-medium text-text-secondary hover:text-accent hover:border-accent whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-surface border-t border-border-dark shrink-0">
            <form 
              onSubmit={e => { e.preventDefault(); handleSend(input) }}
              className="relative"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about production..."
                className="w-full bg-primary border border-border-dark rounded-xl pl-4 pr-12 py-3 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
