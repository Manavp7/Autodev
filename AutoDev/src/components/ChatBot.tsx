import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { cn } from '../utils/cn'

const KB: Record<string, string[]> = {
  greet:     ['hello','hi','hey','good morning'],
  program:   ['program','portfolio','vehicle','project','p-2025'],
  eco:       ['eco','engineering change','ecr','change order'],
  apqp:      ['apqp','gate','ppap','gate review','approval'],
  dvpr:      ['dvpr','dvp','test','validation','verification'],
  bom:       ['bom','bill of materials','component','part number'],
  document:  ['document','library','file','upload','pdf'],
  task:      ['task','my tasks','action item','overdue','to do'],
  timeline:  ['timeline','milestone','schedule','gantt','date'],
  prototype: ['prototype','build','test fixture','sample'],
  help:      ['help','what can you do','features'],
}

const RESPONSES: Record<string, string> = {
  greet: "Hello! I'm your AutoDev assistant. How can I help you today?",
  program: "The **Program Portfolio** module allows you to track all vehicle development projects. You can create a new program, define gates, and track overall progress.",
  eco: "**Engineering Change Orders (ECO)** can be managed in the Engineering Change hub. You can submit, review, and approve ECOs with full BOM traceability.",
  apqp: "**APQP Gates** are critical milestones. You can review required PPAP elements, sign off on deliverables, and track readiness for each gate in the APQP Tracker.",
  dvpr: "The **DVP&R** (Design Verification Plan and Report) module helps you manage test plans, link them to requirements, and track test results for validation.",
  bom: "The **Bill of Materials (BOM)** Hub provides a real-time, structured view of your components and assemblies. It links directly with CAD and ECOs.",
  document: "You can find all specs, 3D models, and PPAP records in the **Document Library**. It supports version control and secure sharing.",
  task: "Check your **My Tasks** dashboard to see pending actions, overdue approvals, and assigned engineering changes.",
  timeline: "The **Program Timeline** provides a Gantt chart view of all major milestones, gates, and deliverables for your vehicle program.",
  prototype: "In the **Prototype Build** module, you can manage test fixtures, track sample builds, and link them to specific DVP&R tests.",
  help: "I can help answer questions about our modules: **Programs, BOM, ECO, DVP&R, APQP, Documents, Timeline, and Prototypes**. What would you like to know?",
  default: "I'm not sure about that. Try asking about **Programs, ECOs, BOM, DVP&R, or APQP Gates**."
}

interface Message {
  id: string
  text: string
  sender: 'bot' | 'user'
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi there! I'm the AutoDev Assistant. Ask me about Programs, ECOs, BOM, or APQP.", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    const newMsg: Message = { id: Date.now().toString(), text: userMsg, sender: 'user' }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let intent = 'default'
      const lowerInput = userMsg.toLowerCase()
      
      for (const [key, keywords] of Object.entries(KB)) {
        if (keywords.some(kw => lowerInput.includes(kw))) {
          intent = key
          break
        }
      }

      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), text: RESPONSES[intent], sender: 'bot' }
      ])
      setIsTyping(false)
    }, 1000)
  }

  const formatMessage = (text: string) => {
    // Basic bold markdown parsing for bot
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-text-primary">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-2xl shadow-accent/30 hover:scale-105 transition-all z-50",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <MessageCircle size={28} />
      </button>

      <div
        className={cn(
          "fixed bottom-6 right-6 w-[380px] h-[520px] glass border border-border-dark shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="h-16 bg-surface border-b border-border-dark flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary leading-tight">AutoDev Assistant</h3>
              <span className="text-[10px] text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Online
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-primary rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary/50">
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex w-full", msg.sender === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                msg.sender === 'user' 
                  ? "bg-accent text-white rounded-tr-sm" 
                  : "bg-surface border border-border-dark text-text-secondary rounded-tl-sm"
              )}>
                {msg.sender === 'bot' ? formatMessage(msg.text) : msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="bg-surface border border-border-dark rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-surface border-t border-border-dark shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full bg-primary border border-border-dark rounded-xl pl-4 pr-12 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-2 text-accent disabled:text-text-secondary/50 hover:bg-accent/10 rounded-lg transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
