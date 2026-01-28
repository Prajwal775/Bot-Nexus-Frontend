
import React, { useState } from 'react';

interface ChatDetailsProps {
  sessionId: string;
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ sessionId }) => {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Session List Mini Sidebar (Optional, mimicking the screenshot's list) */}
      <aside className="w-80 border-r border-border-dark flex flex-col bg-sidebar-dark shrink-0">
        <div className="p-6 border-b border-border-dark">
          <h1 className="text-white text-base font-bold">Chat Logs</h1>
          <p className="text-[#ab9db9] text-xs font-normal">Monitoring Mode Active</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-border-dark bg-primary/10 border-l-4 border-l-primary cursor-pointer">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-bold text-white">{sessionId}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">Handover</span>
            </div>
            <p className="text-xs text-white font-medium truncate">Jane Doe</p>
            <p className="text-[11px] text-[#ab9db9] truncate mt-1">"I need help with my billing cycle..."</p>
            <p className="text-[10px] text-[#6d5b7e] mt-2">2 mins ago</p>
          </div>
          {[
            { id: '#8823-A', user: 'Michael Smith', status: 'AI Active', preview: 'How do I reset my password?', time: '15 mins ago' },
            { id: '#8821-C', user: 'Sarah Wilson', status: 'Resolved', preview: 'Thank you for the quick support.', time: '1 hour ago' }
          ].map(s => (
            <div key={s.id} className="p-4 border-b border-border-dark hover:bg-white/5 cursor-pointer transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-white">{s.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  s.status === 'AI Active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-[#ab9db9]'
                }`}>{s.status}</span>
              </div>
              <p className="text-xs text-white font-medium truncate">{s.user}</p>
              <p className="text-[11px] text-[#ab9db9] truncate mt-1">"{s.preview}"</p>
              <p className="text-[10px] text-[#6d5b7e] mt-2">{s.time}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col bg-[#191022] min-w-0">
        <header className="flex flex-wrap justify-between items-center gap-3 p-6 border-b border-border-dark">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-[#302839] flex items-center justify-center text-primary">
              <span className="material-symbols-outlined size-6">person</span>
            </div>
            <div className="flex flex-col">
              <p className="text-white text-xl font-bold leading-tight">Session {sessionId}</p>
              <p className="text-[#ab9db9] text-sm font-normal">Jane Doe • Active for 14 minutes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#302839] text-white text-sm font-medium hover:bg-[#473b54] transition-colors">
              <span className="material-symbols-outlined mr-2 text-lg">pause</span>
              Pause AI
            </button>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#302839] text-white text-sm font-medium hover:bg-[#473b54] transition-colors"
            >
              <span className="material-symbols-outlined mr-2 text-lg">info</span>
              {showInfo ? 'Hide Info' : 'Show Info'}
            </button>
            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined mr-2 text-lg">check_circle</span>
              Close Session
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-border-dark px-6 gap-8 bg-transparent">
          {['All Messages', 'AI Thought Log', 'Internal Notes'].map((tab, idx) => (
            <button 
              key={tab} 
              className={`flex flex-col items-center justify-center pb-3 pt-4 border-b-2 transition-colors ${
                idx === 0 ? 'border-primary text-white font-bold' : 'border-transparent text-[#ab9db9] hover:text-white'
              }`}
            >
              <p className="text-sm tracking-[0.015em]">{tab}</p>
            </button>
          ))}
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Message */}
          <div className="flex items-start gap-3">
            <div className="bg-[#302839] size-8 rounded-full flex items-center justify-center text-[#ab9db9] mt-1 shrink-0">
              <span className="material-symbols-outlined text-sm">person</span>
            </div>
            <div className="flex flex-col gap-1 items-start max-w-[70%]">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-bold">Jane Doe</span>
                <span className="text-[#6d5b7e] text-[10px]">10:42 AM</span>
              </div>
              <p className="text-sm font-normal leading-relaxed rounded-2xl rounded-tl-none px-4 py-3 bg-[#302839] text-white">
                Hi, I need help with my billing cycle. The AI keeps redirecting me to the FAQ, but my issue is specific to a duplicate charge.
              </p>
            </div>
          </div>

          {/* AI Message */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="bg-primary/20 text-primary aspect-square rounded-full w-8 shrink-0 flex items-center justify-center mt-1">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
            </div>
            <div className="flex flex-col gap-1 items-end max-w-[70%]">
              <div className="flex items-center gap-2">
                <span className="text-[#6d5b7e] text-[10px]">10:42 AM</span>
                <span className="text-xs font-bold text-white flex items-center">
                  AI Assistant 
                  <span className="ml-1.5 px-1 bg-primary/20 text-primary text-[9px] rounded font-black tracking-tighter uppercase">AI</span>
                </span>
              </div>
              <p className="text-sm font-normal leading-relaxed rounded-2xl rounded-tr-none px-4 py-3 bg-[#251e2e] border border-border-dark text-white">
                I understand you have a duplicate charge. Have you checked the "Billing History" section in your account dashboard? Most duplicate charges are actually pending authorizations.
              </p>
            </div>
          </div>

          {/* System Event */}
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <span className="material-symbols-outlined text-sm">hail</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Human Handover Requested</span>
            </div>
          </div>

          {/* Agent Message */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="bg-primary size-8 rounded-full flex items-center justify-center text-white mt-1 shrink-0 border-2 border-primary">
              <span className="material-symbols-outlined text-sm">support_agent</span>
            </div>
            <div className="flex flex-col gap-1 items-end max-w-[70%]">
              <div className="flex items-center gap-2">
                <span className="text-[#6d5b7e] text-[10px]">10:44 AM</span>
                <span className="text-xs font-bold text-primary">Alex (Agent)</span>
              </div>
              <p className="text-sm font-normal leading-relaxed rounded-2xl rounded-tr-none px-4 py-3 bg-primary text-white shadow-lg shadow-primary/20">
                Hi Jane, I'm Alex from the support team. I've taken over this chat. I can see two identical transactions for $49.00 on Oct 12. Let me look into why the system didn't automatically flag this.
              </p>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="p-6 border-t border-border-dark bg-transparent">
          <div className="relative bg-[#302839] rounded-xl border border-[#473b54] p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-white text-sm min-h-[80px] resize-none" 
              placeholder="Type your response as Alex..."
            ></textarea>
            <div className="flex justify-between items-center mt-2 px-2 pb-1">
              <div className="flex gap-2">
                <button className="p-1.5 text-[#ab9db9] hover:bg-white/10 rounded transition-colors">
                  <span className="material-symbols-outlined text-xl">attach_file</span>
                </button>
                <button className="p-1.5 text-[#ab9db9] hover:bg-white/10 rounded transition-colors">
                  <span className="material-symbols-outlined text-xl">mood</span>
                </button>
                <div className="h-6 w-px bg-[#473b54] mx-1"></div>
                <button className="flex items-center gap-2 px-2 py-1 text-[11px] font-bold text-primary bg-primary/10 rounded border border-primary/20">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  PRESETS
                </button>
              </div>
              <button className="bg-primary text-white rounded-lg px-6 py-2 text-sm font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Sidebar */}
      {showInfo && (
        <aside className="w-72 border-l border-border-dark flex flex-col bg-sidebar-dark overflow-y-auto shrink-0 z-10">
          <div className="p-6 space-y-8">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#6d5b7e] uppercase tracking-widest">Handover Context</h3>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-xs font-bold text-amber-400 mb-1">Reason</p>
                <p className="text-sm text-white leading-relaxed italic">"User requested a real person after 2 failed billing explanations."</p>
                <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between">
                  <span className="text-[10px] text-amber-400/70">AI Confidence Score</span>
                  <span className="text-[10px] font-bold text-red-500">24%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#6d5b7e] uppercase tracking-widest">Session Metadata</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#ab9db9]">public</span>
                  <span className="text-xs font-medium text-[#ab9db9]">IP Address</span>
                </div>
                <span className="text-xs font-bold text-white">192.168.1.44</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#ab9db9]">location_on</span>
                  <span className="text-xs font-medium text-[#ab9db9]">Location</span>
                </div>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  🇺🇸 New York, US
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#ab9db9]">token</span>
                  <span className="text-xs font-medium text-[#ab9db9]">Tokens Used</span>
                </div>
                <span className="text-xs font-bold text-white">1,420</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#6d5b7e] uppercase tracking-widest">User Details</h3>
              <div className="bg-[#302839] rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-[10px] text-[#ab9db9]">Email</p>
                  <p className="text-xs font-bold text-white">jane.doe@example.com</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#ab9db9]">Customer Since</p>
                  <p className="text-xs font-bold text-white">Jan 2023</p>
                </div>
                <button className="w-full py-2 bg-[#473b54] rounded text-[11px] font-bold text-white hover:bg-[#5a4c6a] transition-colors">
                  VIEW FULL PROFILE
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default ChatDetails;
