import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

const KB = {
  greet: ["hello","hi","hey","good morning","good afternoon"],
  po: ["purchase order","po","pos","po status","order"],
  pr: ["purchase requisition","pr","prs","requisition"],
  supplier: ["supplier","vendor","onboard","supplier performance"],
  rfq: ["rfq","tender","quotation","bid","quote"],
  grn: ["grn","goods receipt","gate entry","iqc","inspection"],
  shortage: ["shortage","expedite","critical","stock out","delay"],
  contract: ["contract","renewal","expiry","rate contract"],
  dashboard: ["dashboard","kpi","report","analytics","chart"],
  export: ["export","csv","download","excel"],
  help: ["help","what can you do","features","commands"],
};

const RESPONSES = {
  greet: "👋 Hello! I'm **AutoSCM AI Assistant**. I can help you with:\n• PO/PR status and creation\n• Supplier performance & onboarding\n• RFQ bid comparisons\n• Shortage alerts & expediting\n• Contract renewals\n• Data exports\n\nJust ask me anything!",
  po: "📦 **Purchase Orders Summary:**\n• **1,247** Active POs in the system\n• **87** are currently Overdue\n• **342** Closed this quarter\n• Top supplier by PO count: **Bosch India (78 POs)**\n\n💡 *Tip: To create a PO, go to Purchase Orders → Create PO. Select supplier from the dropdown — any supplier you've onboarded will appear instantly.*",
  pr: "📝 **Purchase Requisitions:**\n• **534** Total PRs\n• **~130** Pending Approval — need your attention\n• **~200** Approved, ready to convert to POs\n\n✅ *You can Approve/Reject PRs directly from the table, and Convert approved PRs to POs with one click.*",
  supplier: "🏭 **Supplier Overview:**\n• **500** Registered suppliers\n• **~45** Gold-rated, **~15** Critical\n• Average OTD: **87.4%**\n• Average IQC Pass: **89.2%**\n\n🔗 *To onboard a new supplier: Supplier Management → Onboard Supplier. They'll instantly appear in all PO/RFQ dropdowns.*\n\n📊 *Check Supplier Performance for PPAP, Audit Score, NCR count, and a Radar chart deep-dive.*",
  rfq: "📋 **RFQ / Tenders:**\n• **586** Total RFQs\n• Click any **RFQ ID** to see full details + received quotes\n• Use **Compare Bids** on 'Under Evaluation' RFQs to see side-by-side pricing\n• Click **Award** to mark a winner\n\n💡 *You can link an RFQ to an existing approved PR for traceability.*",
  grn: "📦 **Goods Receipt (GRN):**\n• **600** GRN records\n• Items in **Pending IQC** can be dispositioned → click **IQC Disposition** to Accept All, Partial Accept, or Reject All\n• Accepted items show a **3-Way Match** badge\n\n🏭 *Create a GRN by selecting the source PO — supplier is auto-filled.*",
  shortage: "⚠️ **Shortage Alerts:**\n• **~130** Critical shortages flagged\n• Top affected parts: Crankshaft, Piston Assembly, ECU\n• Click **Expedite** on any row → choose action type (Air Freight, Premium Shift, etc.)\n• Expedited items automatically downgrade in severity\n\n📊 *Export the full risk report via the Export button.*",
  contract: "📑 **Contract Management:**\n• **584** Total contracts\n• Check **Expiring <30d** count for urgent renewals\n• Click **Initiate Renewal** to extend by 1 year\n• Expired contracts can be **Re-activated**\n• Click any Contract ID for full details\n\n➕ *Create new contracts via New Contract button — select supplier from the master list.*",
  dashboard: "📊 **Executive Dashboard** includes:\n• 6 KPI cards (Active POs, OTD, Shortages, Cycle Time, Savings, Contract Coverage)\n• Spend by Category (Pie), Monthly PO Volume (Area), OTD Trend (Line)\n• Top Suppliers by Spend (Bar), Shortage Severity (Stacked Bar)\n• Quality Trend, Procurement Pipeline (Funnel-style), Live Shortage Alerts\n\n💡 *Switch currency (₹/$/€) from the custom dropdown in the topbar — all values update live without any flickering!*",
  export: "📥 **Export to CSV:**\nEvery module has an **Export** button that downloads the current filtered data as a `.csv` file.\n\nSupported exports:\n• Suppliers, PRs, POs, RFQs, GRNs, Shortages, Contracts, Supplier Performance\n\n💡 *The export respects your current search/filter — so filter first, then export for targeted data.*",
  help: "🤖 I'm your **AutoSCM AI Assistant**. Here's what I can help with:\n\n| Command | What it does |\n|---------|-------------|\n| `PO status` | Purchase Order overview |\n| `supplier` | Supplier stats & onboarding help |\n| `shortage` | Critical alerts & expediting |\n| `rfq` | RFQ/Tender management |\n| `grn` | Goods Receipt & IQC |\n| `contract` | Contract renewals |\n| `export` | CSV export help |\n| `dashboard` | KPI & chart info |\n\nOr just ask a question in plain English!",
  fallback: "🤔 I'm not sure about that specific query. Here are things I can help with:\n• **PO/PR** management\n• **Supplier** performance & onboarding\n• **RFQ** bid comparison\n• **Shortage** alerts\n• **Contract** renewals\n• **Export** data\n\nTry asking about one of these topics!"
};

function matchIntent(input) {
  const lower = input.toLowerCase().trim();
  for (const [intent, keywords] of Object.entries(KB)) {
    if (keywords.some(kw => lower.includes(kw))) return intent;
  }
  return 'fallback';
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "👋 Hi! I'm the **AutoSCM AI Assistant**. Ask me anything about your supply chain — POs, suppliers, shortages, exports, and more!", ts: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const intent = matchIntent(input);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: RESPONSES[intent], ts: new Date() }]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-primary px-1 rounded text-accent text-xs">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] transition-all hover:scale-110"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-[10px] text-white flex items-center justify-center font-bold">AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[550px] bg-surface border border-border-dark rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-accent/10 border-b border-border-dark">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">AutoSCM AI</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span> Online
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-primary rounded text-text-secondary hover:text-text-primary transition-colors">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-primary rounded text-text-secondary hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                )}
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-accent text-white rounded-br-sm'
                    : 'bg-primary border border-border-dark text-text-primary rounded-bl-sm'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                  <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-text-secondary'}`}>
                    {msg.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-primary border border-border-dark px-4 py-3 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 border-t border-border-dark flex gap-2 overflow-x-auto custom-scrollbar">
            {['PO Status','Suppliers','Shortages','Export Help'].map(q => (
              <button key={q} onClick={() => { setInput(q); }} className="shrink-0 px-3 py-1 bg-primary border border-border-dark rounded-full text-xs text-text-secondary hover:text-accent hover:border-accent transition-colors">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border-dark flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about POs, suppliers, shortages..."
              className="flex-1 bg-primary border border-border-dark rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
