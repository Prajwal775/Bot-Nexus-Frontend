
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Oct 01', value: 400 },
  { name: 'Oct 07', value: 800 },
  { name: 'Oct 14', value: 600 },
  { name: 'Oct 21', value: 950 },
  { name: 'Oct 28', value: 700 },
  { name: 'Oct 31', value: 850 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; trendType: 'up' | 'down'; subtitle: string }> = ({ 
  title, value, trend, trendType, subtitle 
}) => (
  <div className="bg-card-dark border border-border-dark p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[#ab9db9] text-sm font-medium">{title}</p>
      <span className={`text-xs font-bold px-2 py-1 rounded ${
        trendType === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
      }`}>
        {trend}
      </span>
    </div>
    <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
    <p className="text-[#ab9db9] text-xs">{subtitle}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <header className="h-16 border-b border-border-dark bg-background-dark/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
        <div className="flex items-center gap-4">
          <button className="size-10 rounded-lg flex items-center justify-center text-[#ab9db9] hover:bg-border-dark relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-background-dark"></span>
          </button>
          <button className="size-10 rounded-lg flex items-center justify-center text-[#ab9db9] hover:bg-border-dark">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <div className="p-8 flex flex-col gap-6">
        {/* Alert Section */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
              <span className="material-symbols-outlined text-2xl">priority_high</span>
            </div>
            <div>
              <p className="font-bold text-white">Attention Required</p>
              <p className="text-[#ab9db9] text-sm">5 chats failed to resolve user intent in the last hour. AI confidence score dropped below threshold (0.65).</p>
            </div>
          </div>
          <button className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all shrink-0">
            Take Control
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Sessions" 
            value="12,840" 
            trend="+12.5%" 
            trendType="up" 
            subtitle="Sessions in last 30 days" 
          />
          <StatCard 
            title="GPT Tokens" 
            value="1.2M" 
            trend="-5.2%" 
            trendType="down" 
            subtitle="~ $244.00 estimated cost" 
          />
          <StatCard 
            title="Human Interventions" 
            value="142" 
            trend="+8.1%" 
            trendType="up" 
            subtitle="Handoffs to support agents" 
          />
        </div>

        {/* Chart Section */}
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">30-Day Session Volume</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#ab9db9] text-sm">385,201 total chats in period</span>
                <span className="text-emerald-500 text-xs font-bold">+14% vs prev.</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-semibold bg-border-dark text-white rounded-md">Last 30 Days</button>
              <button className="px-3 py-1.5 text-xs font-semibold hover:bg-border-dark text-[#ab9db9] rounded-md transition-colors">Last 7 Days</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7f13ec" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7f13ec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#302839" />
                <XAxis dataKey="name" stroke="#ab9db9" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ab9db9" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1d1926', border: '1px solid #302839', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#7f13ec" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl shadow-sm mb-8">
          <h4 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">label</span>
            Trending Topics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { label: 'Password Reset', value: 85 },
              { label: 'Pricing Inquiry', value: 62 },
              { label: 'Order Tracking', value: 44 }
            ].map((topic) => (
              <div key={topic.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">{topic.label}</span>
                  <span className="text-xs font-bold text-[#ab9db9]">{topic.value}%</span>
                </div>
                <div className="h-2 w-full bg-border-dark rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${topic.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
