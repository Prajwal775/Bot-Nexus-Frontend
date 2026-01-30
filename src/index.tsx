import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './router/Approuter';
import { ChatProvider } from './context/ChatContext';
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>
);