
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [temperature, setTemperature] = useState(70);
  const [confidence, setConfidence] = useState(85);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background-dark/30">
      <header className="h-16 border-b border-border-dark flex items-center justify-between px-8 bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#ab9db9]">Workspace</span>
          <span className="text-[#ab9db9]">/</span>
          <span className="font-medium text-white">Settings</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#ab9db9] hover:bg-white/5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
            <img alt="User Avatar" className="w-full h-full object-cover" src="https://picsum.photos/id/64/100/100" />
          </div>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight text-white">AI & General Settings</h1>
            <p className="text-[#ab9db9]">Fine-tune your model's personality and system behavior</p>
          </div>

          <section className="bg-[#1a161f] border border-[#302839] rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#302839] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">psychology</span>
              <h2 className="text-lg font-bold">AI Configuration</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold mb-1">Gemini API Key</label>
                  <p className="text-xs text-[#ab9db9]">Used for generating responses via Google GenAI.</p>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <div className="flex flex-1 items-stretch">
                    <input className="flex-1 h-11 px-4 bg-[#211c27] border border-[#473b54] rounded-l-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm" type="password" value="sk-gemini-********************************" readOnly />
                    <button className="px-3 border border-l-0 border-[#473b54] bg-[#211c27] rounded-r-lg text-[#ab9db9] hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                  </div>
                  <button className="h-11 px-4 border border-primary text-primary hover:bg-primary/5 font-bold rounded-lg text-xs transition-all flex items-center gap-2 whitespace-nowrap">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Test Key
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold mb-1">Model Selection</label>
                  <p className="text-xs text-[#ab9db9]">Choose the underlying LLM for your bot.</p>
                </div>
                <div className="md:col-span-2">
                  <select className="w-full h-11 px-4 bg-[#211c27] border border-[#473b54] rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer">
                    <option value="gemini-3-flash-preview">Gemini 3 Flash (Fastest)</option>
                    <option value="gemini-3-pro-preview">Gemini 3 Pro (Most Intelligent)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-2">
                <div>
                  <label className="block text-sm font-semibold mb-1">Temperature ({(temperature / 100).toFixed(1)})</label>
                  <p className="text-xs text-[#ab9db9]">Higher values result in more creative output.</p>
                </div>
                <div className="md:col-span-2 flex items-center gap-4">
                  <span className="text-xs font-medium text-[#ab9db9]">Conservative</span>
                  <input className="flex-1 h-2 bg-[#302839] rounded-lg appearance-none cursor-pointer accent-primary" max="100" min="0" type="range" value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))} />
                  <span className="text-xs font-medium text-[#ab9db9]">Creative</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1a161f] border border-[#302839] rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#302839] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>
              <h2 className="text-lg font-bold">General Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold mb-1">Chatbot Name</label>
                  <p className="text-xs text-[#ab9db9]">This name is visible to your customers.</p>
                </div>
                <div className="md:col-span-2">
                  <input className="w-full h-11 px-4 bg-[#211c27] border border-[#473b54] rounded-lg text-sm" type="text" defaultValue="Nexus Assistant" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div>
                  <label className="block text-sm font-semibold mb-1">Chatbot Icon</label>
                  <p className="text-xs text-[#ab9db9]">Upload a custom avatar.</p>
                </div>
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#302839] border-2 border-dashed border-[#473b54] flex items-center justify-center text-[#ab9db9]">
                    <span className="material-symbols-outlined">add_a_photo</span>
                  </div>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-sm font-bold rounded-lg transition-colors border border-white/10">
                    Change Avatar
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1a161f] border border-[#302839] rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#302839] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">transfer_within_a_station</span>
              <h2 className="text-lg font-bold">Handover Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#211c27] rounded-lg border border-[#302839]">
                <div className="flex flex-col">
                  <p className="text-sm font-bold">Automatic Human Handover</p>
                  <p className="text-xs text-[#ab9db9]">Alert agents when bot fails to answer or detects frustration.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-[#302839] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold mb-1">Escalation Email</label>
                  <p className="text-xs text-[#ab9db9]">Where alerts will be sent.</p>
                </div>
                <div className="md:col-span-2">
                  <input className="w-full h-11 px-4 bg-[#211c27] border border-[#473b54] rounded-lg text-sm" placeholder="support@company.com" type="email" defaultValue="ops@botnexus.io" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold mb-1">Confidence Threshold ({confidence}%)</label>
                  <p className="text-xs text-[#ab9db9]">Trigger handover if AI confidence falls below this value.</p>
                </div>
                <div className="md:col-span-2 flex items-center gap-4">
                  <span className="text-xs font-medium text-[#ab9db9]">0%</span>
                  <input className="flex-1 h-2 bg-[#302839] rounded-lg appearance-none cursor-pointer accent-primary" max="100" min="0" type="range" value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))} />
                  <span className="text-xs font-medium text-[#ab9db9]">100%</span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-6">
            <button className="px-6 py-2.5 text-sm font-bold text-[#ab9db9] hover:text-white transition-colors">
              Discard Changes
            </button>
            <button className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
