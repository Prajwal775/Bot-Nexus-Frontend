
import React from 'react';
import { Session } from '../types';

interface ChatLogsProps {
  onSelectSession: (id: string) => void;
}

const sessions: Session[] = [
  { id: '#SESS-92831', startTime: 'Oct 24, 2023 14:21', duration: '12m 45s', type: 'AI Only', status: 'Resolved', userName: 'Jane Doe', lastMessage: 'I need help with my billing cycle...', timeAgo: '2 mins ago' },
  { id: '#SESS-92832', startTime: 'Oct 24, 2023 14:18', duration: '3m 12s', type: 'Human Only', status: 'Active', userName: 'Michael Smith', lastMessage: 'How do I reset my password?', timeAgo: '15 mins ago' },
  { id: '#SESS-92833', startTime: 'Oct 24, 2023 14:15', duration: '8m 05s', type: 'AI + Human', status: 'Pending Intervention', userName: 'Sarah Wilson', lastMessage: 'User requested a real person...', timeAgo: '1 hour ago' },
  { id: '#SESS-92834', startTime: 'Oct 24, 2023 14:02', duration: '45m 12s', type: 'AI Only', status: 'Resolved', userName: 'Anonymous', lastMessage: 'Thank you for the quick support.', timeAgo: '2 hours ago' },
];

const ChatLogs: React.FC<ChatLogsProps> = ({ onSelectSession }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="p-8 pb-0 shrink-0">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight">Chat Logs</h2>
            <p className="text-[#ab9db9]">Monitor and manage all AI and human-led chat sessions</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 h-10 px-4 bg-white/5 border border-border-dark hover:bg-white/10 rounded-lg transition-colors text-sm font-bold">
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Export Logs</span>
            </button>
            <button className="flex items-center gap-2 h-10 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold">
              <span className="material-symbols-outlined text-lg">refresh</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-5">
            <label className="relative block h-11 w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#ab9db9]">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input 
                className="block w-full h-full pl-11 pr-4 bg-card-dark border border-transparent rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent placeholder-[#ab9db9]" 
                placeholder="Search by Session ID or user name..." 
                type="text" 
              />
            </label>
          </div>
          <div className="lg:col-span-7 flex flex-wrap gap-2 justify-end">
            <button className="flex items-center gap-2 h-11 px-4 bg-card-dark border border-transparent rounded-lg text-sm font-medium">
              <span className="material-symbols-outlined text-[#ab9db9]">calendar_today</span>
              <span>Oct 1, 2023 - Oct 31, 2023</span>
              <span className="material-symbols-outlined text-[#ab9db9]">expand_more</span>
            </button>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 h-11 px-4 bg-card-dark border border-transparent rounded-lg text-sm font-medium">
                <span>Type: All Sessions</span>
                <span className="material-symbols-outlined text-[#ab9db9]">expand_more</span>
              </button>
              <button className="flex items-center gap-2 h-11 px-4 bg-card-dark border border-transparent rounded-lg text-sm font-medium">
                <span className="material-symbols-outlined text-[#ab9db9]">filter_list</span>
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        <div className="bg-card-dark rounded-xl border border-border-dark flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-border-dark bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]">Session ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]">Start Time</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{session.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{session.startTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{session.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`material-symbols-outlined text-lg ${
                          session.type === 'AI Only' ? 'text-primary' : 
                          session.type === 'Human Only' ? 'text-blue-400' : 'text-purple-400'
                        }`}>
                          {session.type === 'AI Only' ? 'smart_toy' : 
                           session.type === 'Human Only' ? 'person' : 'mediation'}
                        </span>
                        <span>{session.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' :
                        session.status === 'Active' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          session.status === 'Resolved' ? 'bg-emerald-400' :
                          session.status === 'Active' ? 'bg-blue-400 animate-pulse' :
                          'bg-amber-400 animate-pulse'
                        }`}></span>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {session.status === 'Pending Intervention' ? (
                        <button 
                          onClick={() => onSelectSession(session.id)}
                          className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-primary/20"
                        >
                          Take Over
                        </button>
                      ) : (
                        <button 
                          onClick={() => onSelectSession(session.id)}
                          className="text-primary text-sm font-bold hover:underline"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-border-dark flex items-center justify-between bg-white/5">
            <p className="text-sm text-[#ab9db9]">
              Showing <span className="font-bold text-white">4</span> to <span className="font-bold text-white">4</span> of <span className="font-bold text-white">458</span> sessions
            </p>
            <div className="flex gap-2">
              <button className="size-9 flex items-center justify-center rounded-lg border border-border-dark hover:bg-white/5 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">1</button>
              <button className="size-9 flex items-center justify-center rounded-lg border border-border-dark hover:bg-white/5 font-bold text-sm">2</button>
              <button className="size-9 flex items-center justify-center rounded-lg border border-border-dark hover:bg-white/5">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLogs;
