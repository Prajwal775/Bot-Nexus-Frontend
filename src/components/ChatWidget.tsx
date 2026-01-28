
import React, { useState } from 'react';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-50">
      {isOpen && (
        <div className="w-[400px] h-[600px] bg-[#1f1629] rounded-xl flex flex-col overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-white/10 animate-in slide-in-from-bottom-5 duration-300">
          <header className="bg-gradient-to-br from-primary to-purple-600 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined material-symbols-fill">smart_toy</span>
                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-tight">BotNexus Support</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border-2 border-white/20" 
                style={{ backgroundImage: 'url("https://picsum.photos/id/102/100/100")' }}></div>
              <div className="flex flex-col">
                <p className="text-white text-xl font-bold leading-tight">Welcome</p>
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-white/80 text-sm font-normal">Active & Online</p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="flex items-end gap-3">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0" 
                style={{ backgroundImage: 'url("https://picsum.photos/id/102/100/100")' }}></div>
              <div className="flex flex-1 flex-col gap-1 items-start">
                <p className="text-[#ab9db9] text-[12px] font-medium ml-1">Nexus Assistant</p>
                <div className="text-sm font-normal leading-relaxed flex max-w-[280px] rounded-xl rounded-bl-none px-4 py-3 bg-[#302839] text-white">
                  Hi there! I'm your Nexus assistant. How can I help you build your identity today?
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-11">
              <p className="text-[#ab9db9] text-[11px] font-bold uppercase tracking-wider mb-1">Choose a topic</p>
              {['How it works', 'Pricing Plans', 'Our Services', 'Talk to Human'].map(topic => (
                <button 
                  key={topic}
                  className="flex items-center justify-between group min-w-[84px] cursor-pointer rounded-lg h-11 px-4 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 text-white text-sm font-medium transition-all"
                >
                  <span className="truncate">{topic}</span>
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <label className="flex flex-1 items-center bg-[#302839] rounded-xl px-4 py-1 h-12 focus-within:ring-2 ring-primary/50 transition-all">
                <input className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-[#ab9db9] text-sm" placeholder="Type your question..." />
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-1.5 text-[#ab9db9] hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>
                  <button className="p-1.5 text-[#ab9db9] hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                  </button>
                </div>
              </label>
              <button className="size-12 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            <p className="text-center text-[10px] text-[#ab9db9] mt-3">Powered by BotNexus AI</p>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-primary to-purple-500 size-16 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer group relative"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">
          {isOpen ? 'close' : 'chat'}
        </span>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full border-2 border-background-dark flex items-center justify-center text-[10px] font-bold">1</div>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
