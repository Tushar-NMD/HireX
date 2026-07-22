import { useState, useRef, useEffect } from "react";
import conf from "../config/index.js";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    setChipsVisible(false);
    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${conf.apiBaseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || 'Failed to get response');
      }
      
      const data = await res.json();
      
      console.log('AI Response:', data);
      
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer, jobs: data.jobs || [] },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `Error: ${error.message}. Please try again later.` },
      ]);
    }
    setLoading(false);
  };

  const CHIPS = ["🔍 Total jobs", "💻 Data science jobs", "📍 Recent jobs", "🏢 Remote jobs"];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer border-0"
          style={{ 
            background: "linear-gradient(135deg,#f5e6c8 0%,#d4af37 45%,#b8962e 100%)",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
          }}
        >
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-black animate-ping" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-black" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[99999] isolate w-full h-full sm:w-[370px] sm:h-auto sm:max-h-[600px] bg-black/80 backdrop-blur-xl sm:rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.65)] border-0 sm:border sm:border-white/10 flex flex-col overflow-hidden font-sans"
          style={{ 
            fontFamily: "'Plus Jakarta Sans', sans-serif", 
            animation: "slideUp .4s cubic-bezier(.34,1.56,.64,1) both" 
          }}
        >

        {/* Header */}
        <div className="relative overflow-hidden flex items-center gap-3 px-4 py-4 sm:py-4"
          style={{ background: "linear-gradient(135deg,#f5e6c8 0%,#d4af37 45%,#b8962e 100%)" }}>
          <div className="w-9 h-9 bg-black/10 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
            <svg className="w-[18px] h-[18px] text-black" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.97 9.97 0 0 1-5.25-1.48L2 22l1.48-4.75A9.97 9.97 0 0 1 2 12 10 10 0 0 1 12 2z"/>
              <circle cx="8.5" cy="12" r="1.2" fill="black"/><circle cx="12" cy="12" r="1.2" fill="black"/><circle cx="15.5" cy="12" r="1.2" fill="black"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-black font-bold text-sm">Job Search Assistant</p>
            <p className="text-black/75 text-[11px] font-medium">Real-time database search</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/10 hover:bg-black/20 transition-colors cursor-pointer border-0"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="h-full sm:h-[300px] flex-1 overflow-y-auto flex flex-col gap-3 p-4 bg-black/20">
        {messages.length === 0 && (
          <div className="m-auto text-center text-zinc-500">
            <p className="text-[12.5px] font-medium">Ask me about available jobs<br/>by role, location, or count!</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start items-end gap-2"}`}>
            {m.role === "bot" && (
              <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#d4af37,#b8962e)" }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="black">
                  <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v1h4V6a2 2 0 0 0-2-2zm-1 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
                </svg>
              </div>
            )}
            <div className={`max-w-[78%] px-3 py-2.5 text-[13px] leading-relaxed rounded-2xl
              ${m.role === "user"
                ? "text-black rounded-br-[4px]"
                : "bg-white/5 text-white border border-white/10 shadow-sm rounded-bl-[4px]"}`}
              style={m.role === "user" ? { background: "linear-gradient(135deg,#f5e6c8 0%,#d4af37 45%,#b8962e 100%)" } : {}}>
              <p style={{ whiteSpace: 'pre-line' }}>{m.text}</p>
              {m.jobs?.length > 0 && (
                <div className="mt-2 p-2 bg-amber-950/20 border border-amber-900/30 rounded-lg">
                  <p className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {m.jobs.length} Job{m.jobs.length > 1 ? 's' : ''} Found
                  </p>
                  {m.jobs.slice(0, 3).map((job, idx) => (
                    <div key={idx} className="text-[11.5px] text-amber-200 mb-1">
                      → {job.title} at {job.company}
                      <br/>
                      <span className="text-[10px] text-amber-400/80 ml-2">📍 {job.location} | 💰 {job.salary}</span>
                    </div>
                  ))}
                  {m.jobs.length > 3 && (
                    <p className="text-[10px] text-amber-500 italic mt-1">
                      +{m.jobs.length - 3} more jobs...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#d4af37,#b8962e)" }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="black">
                <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v1h4V6a2 2 0 0 0-2-2zm-1 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
              </svg>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-[4px] px-4 py-3 flex gap-1.5 items-center shadow-sm">
              {[0, 200, 400].map((d) => (
                <div key={d} className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                  style={{ animation: `bounce 1.2s ${d}ms infinite` }} />
              ))}
            </div>
          </div>
        )}
          <div ref={bottomRef} />
        </div>

        {/* Quick chips */}
        {chipsVisible && (
          <div className="flex flex-wrap gap-1.5 px-3.5 py-2.5 bg-black/40 border-t border-white/10">
          {CHIPS.map((chip) => (
            <button key={chip}
              onClick={() => sendMessage(chip.replace(/^[^\s]+\s/, ""))}
              className="px-2.5 py-1.5 sm:py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-semibold text-amber-400 hover:bg-white/10 transition-colors cursor-pointer">
              {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 px-3.5 py-3 sm:py-3 border-t border-white/10 bg-black/40 safe-bottom">
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-2 text-[13px] text-white placeholder-zinc-500 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
        />
        <button onClick={() => sendMessage()}
          className="w-[42px] h-[42px] sm:w-[38px] sm:h-[38px] rounded-xl flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer border-0"
          style={{ background: "linear-gradient(135deg,#d4af37,#b8962e)", boxShadow: "0 3px 12px rgba(212,175,55,0.25)" }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[10.5px] text-zinc-500 font-medium pb-2.5 bg-black/40">
          Real-time job data from <span className="text-amber-400 font-bold">HireX Database</span>
        </p>
      </div>
      )}

      <style>{`
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.6)}50%{box-shadow:0 0 0 10px rgba(212,175,55,0)}}
        
        .safe-bottom {
          padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
        }

        @media (max-width: 640px) {
          @keyframes slideUp{
            from{opacity:0;transform:translateY(100%)}
            to{opacity:1;transform:translateY(0)}
          }
        }
      `}</style>
    </>
  );
}