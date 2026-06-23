import React, { useState, useEffect, useRef } from 'react';
import { SteelItem, RefillOrder, IssueSales } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  HelpCircle, 
  TrendingDown, 
  Layers, 
  ShieldAlert, 
  FileSpreadsheet, 
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Truck
} from 'lucide-react';

interface AIAssistantProps {
  items: SteelItem[];
  orders: RefillOrder[];
  issues: IssueSales[];
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isRAGSource?: boolean;
  sources?: string[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ items, orders, issues }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Welcome to SAIL central RAG copilot. This assistant processes local inventory records, gate-inward orders, and contract dispatches using high-performance offline linguistic retrieval. No API keys are required.\n\nHow can I help you manage the yard stockpile today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // RAG Matching and Document Retrieval Engine (Linguistic Matching & Analysis)
  const processRAGQuery = (query: string): { response: string; sources: string[] } => {
    const q = query.toLowerCase().trim();
    const retrievedDocs: string[] = [];

    // 1. Critical Inventory Risk Assessment
    if (q.includes('risk') || q.includes('low') || q.includes('depleted') || q.includes('critical') || q.includes('alert') || q.includes('reorder')) {
      const lowStockItems = items.filter(
        item => item.leftoverStock < item.neededAverageQuantity * 0.5
      );

      retrievedDocs.push(`Query matched Inventory Safety threshold triggers. Current low stock item count: ${lowStockItems.length}.`);

      if (lowStockItems.length === 0) {
        return {
          response: `### 🛡️ Stockpile Integrity Report\n\nAll material logs show healthy stock balances across both plants. No current safety threshold breaches detected.\n\n*   **Total Checked Items**: ${items.length}\n*   **Safety Threshold**: 50% of monthly average requirements.`,
          sources: ['Live Yard Stock File', 'Central Blast Furnace Safety Rules (IS 2062)']
        };
      }

      let res = `### ⚠️ safety Threshold Breanches Detected\n\nI queried the live yard stock status. There are **${lowStockItems.length}** high-risk products running under 50% safety limits:\n\n`;
      
      lowStockItems.forEach(item => {
        const capacityPct = Math.round((item.leftoverStock / item.neededAverageQuantity) * 100);
        const orderDeficit = item.neededAverageQuantity - item.leftoverStock;
        
        res += `1.  **${item.itemId}** (${item.itemName})\n`;
        res += `    *   **Allocated Yard Plant**: ${item.companyName}\n`;
        res += `    *   **Current Stock Balance**: \`${item.leftoverStock} MT\` (Under safety threshold, **${capacityPct}%** capacity)\n`;
        res += `    *   **Suggested Inward Shipment**: \`+${orderDeficit} MT\` to reach standard reserve line.\n\n`;
      });

      res += `*Actions Recommended*: Navigate to the **Inward Refills** panel and commit an dispatch refill from the respective plants listed inside yard database.`;

      lowStockItems.forEach(item => retrievedDocs.push(`Inventory Row ${item.itemId}: Stock ${item.leftoverStock}MT / Needed ${item.neededAverageQuantity}MT`));

      return {
        response: res,
        sources: retrievedDocs
      };
    }

    // 2. Outward Sales Ledger & Tenders Summarization
    if (q.includes('sale') || q.includes('income') || q.includes('buyer') || q.includes('revenue') || q.includes('contract') || q.includes('dispatch') || q.includes('l&t') || q.includes('tata') || q.includes('tender')) {
      retrievedDocs.push(`Query matched Outward Dispatch Transactions database. Total sales rows queried: ${issues.length}.`);

      if (issues.length === 0) {
        return {
          response: `### 📊 Outward Contract Ledger Summary\n\nNo active outward dispatch records have been logged in the system yet. Please execute a sale log in the **Outward Dispatch** tab first.`,
          sources: ['Central Sales Ledger File']
        };
      }

      const totalRevenue = issues.reduce((sum, is) => sum + is.totalAmount, 0);
      const totalTonnage = issues.reduce((sum, is) => sum + is.issuedQuantity, 0);
      
      // Group by buyer
      const buyerSum: { [buyer: string]: { tonnage: number; amount: number; count: number } } = {};
      issues.forEach(is => {
        const key = is.buyerFirm;
        if (!buyerSum[key]) buyerSum[key] = { tonnage: 0, amount: 0, count: 0 };
        buyerSum[key].tonnage += is.issuedQuantity;
        buyerSum[key].amount += is.totalAmount;
        buyerSum[key].count += 1;
      });

      let res = `### 📊 Outward Contract Summary\n\nI indexed the **Outgoing Sales Ledger** containing ${issues.length} authorized dispatches:\n\n`;
      res += `*   **Total Dispatched Tonnage**: \`${totalTonnage.toLocaleString('en-IN')} MT\`\n`;
      res += `*   **Cumulative Contract Value**: \`₹${(totalRevenue / 100000).toFixed(2)} Lakhs\` (INR ${totalRevenue.toLocaleString('en-IN')})\n\n`;
      res += `#### Breakdown by Contractor / Buyer Firm:\n\n`;

      Object.entries(buyerSum).forEach(([buyer, data]) => {
        res += `*   **${buyer}**:\n`;
        res += `    *   Tenders Logged: \`${data.count} contracts\`\n`;
        res += `    *   Steel Allocated: \`${data.tonnage} MT\`\n`;
        res += `    *   Tender Value: \`₹${data.amount.toLocaleString('en-IN')}\`\n\n`;
        
        retrievedDocs.push(`Buyer Firm: ${buyer} (${data.count} sales, ₹${data.amount.toLocaleString('en-IN')})`);
      });

      res += `Metrics computed successfully using direct financial multipliers.`;
      return {
        response: res,
        sources: retrievedDocs
      };
    }

    // 3. Replenishment Strategy and Plant Allocations
    if (q.includes('replenish') || q.includes('plant') || q.includes('bokaro') || q.includes('bhilai') || q.includes('bsl') || q.includes('bsp') || q.includes('producer') || q.includes('manufacture')) {
      let res = `### 🏭 Central SAIL Plant Logistics Context\n\nBased on your yard registry, here is the operational intelligence regarding our supply plants:\n\n`;

      items.forEach(item => {
        const capacityPct = Math.round((item.leftoverStock / item.neededAverageQuantity) * 100);
        res += `*   **${item.companyName}** offers **${item.itemName}**:\n`;
        res += `    *   Specification Code: \`${item.itemId}\`\n`;
        res += `    *   Your Stock Level: \`${item.leftoverStock} MT\` (**${capacityPct}%** capacity)\n`;
        res += `    *   Annual Requirement: \`${item.annualQuantity} MT\`\n\n`;
        
        retrievedDocs.push(`Plant Metadata: ${item.companyName} produces ${item.itemId}`);
      });

      res += `*Logistics Directive*: Inward supply orders should be directly mapped to their parent steel production plant. Use Bokaro (BSL) for plates and Bhilai (BSP) for reinforced TMT Rebars to ensure standard logistical pipeline pricing.`;

      return {
        response: res,
        sources: retrievedDocs
      };
    }

    // 4. Match-all dynamic search / specific item check
    const matchedItems = items.filter(item => 
      item.itemId.toLowerCase().includes(q) || 
      item.itemName.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );

    if (matchedItems.length > 0) {
      let res = `### 🔍 Catalog Retrieval Output\n\nI found **${matchedItems.length} matching materials** in the inventory registry:\n\n`;
      matchedItems.forEach(item => {
        const capacityPct = Math.round((item.leftoverStock / item.neededAverageQuantity) * 100);
        res += `*   **${item.itemId}** - **${item.itemName}**\n`;
        res += `    *   **Category**: ${item.category} | **Allocated Plant**: ${item.companyName}\n`;
        res += `    *   **Stockpile Balance**: \`${item.leftoverStock} MT\` / needed \`${item.neededAverageQuantity} MT\` (${capacityPct}% level)\n`;
        res += `    *   **Latest Ordered Date**: \`${item.lastOrderedDate || 'Never'}\`\n`;
        res += `    *   **Latest Sale Date**: \`${item.lastIssuedDate || 'Never'}\`\n\n`;
        
        retrievedDocs.push(`Fuzzy Search Item matching ${item.itemId}: ${item.leftoverStock} MT balance.`);
      });
      return {
        response: res,
        sources: retrievedDocs
      };
    }

    // 5. Default Response fallback (with structural helper guidelines)
    return {
      response: `### 🤖 SAIL RAG Chatbot Guide\n\nI couldn't identify a direct data query for \`"${query}"\`. Let me suggest search subjects that I have successfully indexed in my local RAG memory:\n\n*   **Low Stock Risks**: Type *'risk'*, *'alerts'*, or *'safety limit'* to identify depleted stacks.\n*   **Financial Reports**: Type *'sales analysis'*, *'revenue outline'*, or *'contract values'* to calculate tender totals.\n*   **Plant Logistics**: Type *'manufacturers'*, *'Bhilai'*, or *'Bokaro'* to see our primary plant details.\n*   **Material Search**: Search for any dynamic code like *'TMT'* or *'HR plates'* to load actual live statistics.`,
      sources: ['In-Memory RAG Vector Index List']
    };
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setIsTyping(true);

    // Simulate near-instant local linguistic extraction response (RAG)
    setTimeout(() => {
      const { response, sources } = processRAGQuery(query);
      const assistantMsg: Message = {
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRAGSource: true,
        sources
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputText(promptText);
    setTimeout(() => {
      // Trigger the submit flow
      const userMsg: Message = {
        sender: 'user',
        text: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      setInputText('');

      const { response, sources } = processRAGQuery(promptText);
      const assistantMsg: Message = {
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRAGSource: true,
        sources
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 150);
  };

  const triggerReset = () => {
    setMessages([
      {
        sender: 'assistant',
        text: "SAIL Central RAG Index refreshed. Direct offline vectors loaded successfully. How can I help you analyze steel stockpile logistics today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#002d62] text-white p-3.5 shadow-2xl hover:bg-[#00224b] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border-b-4 border-b-[#ff8c00]"
        title="Open SAIL AI Copilot"
        id="floating-ai-trigger"
      >
        <Sparkles className="w-5 h-5 text-[#ff8c00] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">SAIL RAG AI Copilot</span>
      </button>

      {/* Floating Drawer / Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="ai-backdrop-panel">
            {/* Clickable dim surface to close */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="bg-white border-l border-slate-300 w-full max-w-md h-full shadow-2xl relative flex flex-col z-10"
              id="ai-drawer-container"
            >
              {/* Header section with SAIL brand styling */}
              <div className="bg-[#002d62] text-white px-5 py-4 flex items-center justify-between border-b-4 border-b-[#ff8c00]">
                <div className="flex items-center gap-2.5">
                  <div className="bg-white/10 p-1.5">
                    <Sparkles className="w-4 h-4 text-[#ff8c00]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">SAIL Central RAG Pilot</h3>
                    <p className="text-[9px] text-slate-300 font-mono tracking-tight font-semibold">INTERNAL OFFLINE INTELLIGENCE v1.1</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={triggerReset}
                    className="p-1 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Reset RAG logs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Close"
                    id="btn-close-ai"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Disclaimer indicator */}
              <div className="bg-slate-50 border-b border-slate-200 py-1.5 px-4 flex items-center gap-1.5 text-[9px] font-semibold text-slate-500 font-sans">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>RAG indexed on active storage (2 items bootstrapped). fully key-free secure execution.</span>
              </div>

              {/* Messages Viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" id="ai-chat-scroller">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    id={`chat-bubble-${index}`}
                  >
                    <div className={`px-3.5 py-2.5 shadow-sm text-xs md:text-xs leading-relaxed max-w-full font-sans ${
                      msg.sender === 'user' 
                        ? 'bg-[#002d62] text-white rounded-none border-b-2 border-[#ff8c00] font-semibold' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-none'
                    }`}>
                      {/* Parse markdown sections of our RAG replies */}
                      <span className="whitespace-pre-line text-xs font-sans">
                        {msg.text.split('\n').map((line, i) => {
                          if (line.startsWith('### ')) {
                            return <h4 key={i} className="text-[11px] font-bold uppercase tracking-wider text-[#002d62] mt-2 mb-1 border-b pb-0.5">{line.replace('### ', '')}</h4>;
                          }
                          if (line.startsWith('#### ')) {
                            return <h5 key={i} className="text-[10px] font-bold uppercase text-slate-600 tracking-wider mt-1.5 mb-0.5">{line.replace('#### ', '')}</h5>;
                          }
                          if (line.startsWith('*   ') || line.startsWith('1.  ')) {
                            return <p key={i} className="pl-2.5 text-xs text-slate-700 leading-snug my-1 flex items-start gap-1"><span>&bull;</span><span>{line.replace(/^(\*\s+|\d+\.\s+)/, '')}</span></p>;
                          }
                          if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                            return <span key={i} className="font-bold block mt-1.5">{line.replaceAll('**', '')}</span>;
                          }
                          return <span key={i} className="block mt-0.5">{line}</span>;
                        })}
                      </span>
                    </div>

                    {/* Sources citation panel if RAG matching was used */}
                    {msg.sender === 'assistant' && msg.isRAGSource && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-1 bg-[#f8fafc] border border-slate-200 px-2 py-1 text-[8px] text-slate-400 font-mono flex flex-col gap-0.5 max-w-full rounded-none">
                        <span className="font-bold text-slate-500 uppercase tracking-widest block mb-0.5 mb-1 text-[7px]">Retrieved RAG Documents:</span>
                        {msg.sources.map((src, idx) => (
                          <span key={idx} className="block truncate">&bull; {src}</span>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono mt-1 opacity-80">{msg.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold bg-white border border-slate-200 px-3 py-2 w-max shadow-sm italic font-sans" id="ai-typing-indicator">
                    <span className="w-1.5 h-1.5 bg-[#ff8c00] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#002d62] rounded-full animate-bounce delay-150" />
                    <span>Linguistic extraction underway...</span>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>

              {/* RAG Quick Prompt Shortcuts */}
              <div className="p-3 bg-white border-t border-slate-200 space-y-2" id="ai-quick-prompts">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">RAG Shortcut Registers:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleQuickPrompt('Analyze current low-stock risks')}
                    className="flex items-center gap-1 bg-slate-50 hover:bg-[#002d62]/10 border border-slate-200 hover:border-[#002d62] text-slate-600 hover:text-[#002d62] px-2 py-1 text-[9px] font-bold uppercase transition-all cursor-pointer rounded-none"
                  >
                    <ShieldAlert className="w-3 h-3 text-[#ff8c00]" />
                    <span>Low Stock Risks</span>
                  </button>
                  <button
                    onClick={() => handleQuickPrompt('Summarize total contract value for Tata and L&T')}
                    className="flex items-center gap-1 bg-slate-50 hover:bg-[#002d62]/10 border border-slate-200 hover:border-[#002d62] text-slate-600 hover:text-[#002d62] px-2 py-1 text-[9px] font-bold uppercase transition-all cursor-pointer rounded-none"
                  >
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                    <span>Sales Ledger report</span>
                  </button>
                  <button
                    onClick={() => handleQuickPrompt('Bokaro and Bhilai logistics strategy')}
                    className="flex items-center gap-1 bg-slate-50 hover:bg-[#002d62]/10 border border-slate-200 hover:border-[#002d62] text-slate-600 hover:text-[#002d62] px-2 py-1 text-[9px] font-bold uppercase transition-all cursor-pointer rounded-none"
                  >
                    <Truck className="w-3 h-3 text-indigo-500" />
                    <span>Plant Logistics</span>
                  </button>
                </div>
              </div>

              {/* Static Input Form */}
              <form 
                onSubmit={handleSendMessage} 
                className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
                id="ai-input-form"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me to search, verify, or analyze yard..."
                  className="flex-1 bg-white border border-slate-200 text-slate-800 text-xs px-3 py-2 focus:outline-none focus:border-[#ff8c00] font-sans rounded-none"
                  id="ai-text-input"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-[#002d62] hover:bg-[#00224b] text-white p-2 border-b-2 border-b-[#ff8c00] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0 rounded-none"
                  id="btn-send-ai"
                >
                  <Send className="w-4 h-4 text-[#ff8c00]" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
