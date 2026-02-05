import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import App from '@/App';
import { useAuth } from '@/context/AuthContext';
import KnowledgeBase from '@/pages/knowledge-base/KnowledgeBase';
import AddManualQA from '@/pages/knowledge-base/manual/manualqa';
import Signup from '@/pages/Signup';
import ChatLogs from '@/pages/ChatLogs';
import Home from '@/pages/Home';
import ChatDetails from '@/pages/ChatDetails';

/**
 * ProtectedRoute checks localStorage for authToken and
 * redirects to /login if not present.
 */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }
  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      {/* Protected layout: App is the layout that contains Sidebar/ChatWidget + <Outlet /> */}
      <Route
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/knowledge-base' element={<KnowledgeBase />} />

        <Route path='/knowledge-base/manual' element={<AddManualQA />} />
        <Route path='/chat-logs' element={<ChatLogs />} />
        <Route
          path='/chat-logs/:sessionId'
          element={<ChatDetails readOnly />}
        />

        <Route path='/chats' element={<ChatDetails />} />


        {/* <Route path='/settings' element={<Settings />} /> */}

        {/* add more protected child routes here */}
      </Route>

      {/* Default / fallback */}
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
};

export default AppRoutes;
