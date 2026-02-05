import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { userName } = useAuth();
  const capitalizeName = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/knowledge-base', label: 'Knowledge Base', icon: 'database' },
    { path: '/chat-logs', label: 'Chat Logs', icon: 'forum' },
    { path: '/chats', label: 'Chats', icon: 'chat' },

    // { path: '/settings', label: 'Settings', icon: 'settings' },
  ];
  return (
    <aside className='w-64 border-r border-border-dark bg-sidebar-dark flex flex-col justify-between shrink-0'>
      <div className='flex flex-col gap-8 p-6'>
        {/* Logo */}
        <div className='flex items-center gap-3'>
          <div className='bg-primary size-10 rounded-lg flex items-center justify-center text-white'>
            <span className='material-symbols-outlined text-2xl'>
              smart_toy
            </span>
          </div>
          <div className='flex flex-col'>
            <h1 className='text-white text-base font-bold leading-none'>
              BotNexus
            </h1>
            <p className='text-[#ab9db9] text-[10px] uppercase tracking-widest font-semibold'>
              Enterprise AI
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex flex-col gap-1'>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + '/');

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-primary/10 text-primary border-r-2 border-primary font-bold'
                    : 'text-[#ab9db9] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    isActive ? 'material-symbols-fill' : ''
                  }`}
                >
                  {item.icon}
                </span>
                <span className='text-sm'>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className='px-4 pt-2 pb-6 flex flex-col gap-4'>
        <div className='flex items-center gap-3 p-3 rounded-xl bg-card-dark border border-border-dark -mt-2'>
          <div className='size-9 rounded-full bg-[#302839] flex items-center justify-center'>
            <span className='material-symbols-outlined text-white text-[20px]'>
              person
            </span>
          </div>

          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold truncate text-white'>
              {userName ? capitalizeName(userName) : 'User'}
            </p>
            <p className='text-xs text-[#ab9db9] truncate'>Admin Plan</p>
          </div>
          <button
            onClick={logout}
            className='material-symbols-outlined text-[#ab9db9] text-sm cursor-pointer hover:text-white transition-colors'
          >
            logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
