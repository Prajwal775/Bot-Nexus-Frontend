import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className='flex h-screen bg-background-dark text-white font-display'>
      {isAuthenticated && !isLoginPage && <Sidebar />}

      <main className='flex-1 overflow-y-auto relative'>
        {/* Routed pages render here */}
        <Outlet />
      </main>

      {isAuthenticated && !isLoginPage && <ChatWidget />}
    </div>
  );
};

export default App;
