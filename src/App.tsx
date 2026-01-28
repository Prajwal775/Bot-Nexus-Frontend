
// import React, { useState, useEffect } from 'react';
// import { AppView } from './types';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import KnowledgeBase from './pages/KnowledgeBase';
// import ManualQA from './pages/ManualQA';
// import ChatLogs from './pages/ChatLogs';
// import ChatDetails from './pages/ChatDetails';
// import Settings from './pages/Settings';
// import Sidebar from './components/Sidebar';
// import ChatWidget from './components/ChatWidget';

// const App: React.FC = () => {
//   const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
//   const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for demo
//   const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

//   const handleNavigate = (view: AppView, params?: any) => {
//     if (view === AppView.CHAT_DETAILS && params?.sessionId) {
//       setSelectedSessionId(params.sessionId);
//     }
//     setCurrentView(view);
//   };

//   if (!isAuthenticated && currentView !== AppView.LOGIN) {
//     return <Login onLogin={() => setIsAuthenticated(true)} />;
//   }

//   const renderView = () => {
//     switch (currentView) {
//       case AppView.LOGIN:
//         return <Login onLogin={() => { setIsAuthenticated(true); setCurrentView(AppView.DASHBOARD); }} />;
//       case AppView.DASHBOARD:
//         return <Dashboard />;
//       case AppView.KNOWLEDGE_BASE:
//         return <KnowledgeBase onAddManual={() => setCurrentView(AppView.ADD_MANUAL_QA)} />;
//       case AppView.ADD_MANUAL_QA:
//         return <ManualQA onBack={() => setCurrentView(AppView.KNOWLEDGE_BASE)} />;
//       case AppView.CHAT_LOGS:
//         return <ChatLogs onSelectSession={(id) => handleNavigate(AppView.CHAT_DETAILS, { sessionId: id })} />;
//       case AppView.CHAT_DETAILS:
//         return <ChatDetails sessionId={selectedSessionId || '#8824-B'} />;
//       case AppView.SETTINGS:
//         return <Settings />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-background-dark text-white font-display">
//       {isAuthenticated && currentView !== AppView.LOGIN && (
//         <Sidebar currentView={currentView} onNavigate={handleNavigate} onLogout={() => setIsAuthenticated(false)} />
//       )}
//       <main className="flex-1 flex flex-col overflow-hidden relative">
//         {renderView()}
//       </main>
      
//       {/* User Facing Chat Widget - Always available on demo */}
//       {isAuthenticated && <ChatWidget />}
//     </div>
//   );
// };

// export default App;

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
    <div className="flex h-screen overflow-hidden bg-background-dark text-white font-display">
      {isAuthenticated && !isLoginPage && <Sidebar />}

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Routed pages render here */}
        <Outlet />
      </main>

      {isAuthenticated && !isLoginPage && <ChatWidget />}
    </div>
  );
};

export default App;
