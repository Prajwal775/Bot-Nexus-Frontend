import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

/* ================= TYPES ================= */

type SupportAlert = {
  user_id: number;
  session_id: number;
};

type AdminSocketContextType = {
  send: (payload: any) => void;
  alerts: SupportAlert[];
  removeAlert: (sessionId: number) => void;
  onEvent: (cb: (data: any) => void) => () => void;
};

/* ================= ENV → WS ================= */

function getWsBaseUrl(): string {
  const httpBase = import.meta.env.VITE_API_BASE_URL;
  if (!httpBase) throw new Error('VITE_API_BASE_URL missing');

  return httpBase.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');
}

/* ================= CONTEXT ================= */

const AdminSocketContext = createContext<AdminSocketContextType | null>(null);

/* ================= PROVIDER ================= */

export const AdminSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const pendingQueueRef = useRef<string[]>([]);
  const listenersRef = useRef<Array<(d: any) => void>>([]);

  const { isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState<SupportAlert[]>([]);

  /* ================= CONNECT ================= */

  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const agentId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');
    if (!agentId || !token) return;

    if (socketRef.current) return;

    const ws = new WebSocket(
      `${getWsBaseUrl()}/ws/agent/${agentId}?token=${token}`
    );

    socketRef.current = ws;

    ws.onopen = () => {
      console.log('ADMIN SOCKET CONNECTED');

      // 🔥 Flush queued messages
      while (pendingQueueRef.current.length > 0) {
        const msg = pendingQueueRef.current.shift();
        if (msg) ws.send(msg);
      }
    };

    ws.onmessage = (event) => {
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        console.log('ADMIN RAW:', event.data);
        return;
      }

      if (data.type === 'NEW_ALERT') {
        setAlerts((prev) => [
          ...prev,
          { user_id: data.user_id, session_id: data.session_id },
        ]);
      }

      listenersRef.current.forEach((cb) => cb(data));
    };

    ws.onerror = (e) => console.error('ADMIN SOCKET ERROR', e);

    ws.onclose = () => {
      console.log('ADMIN SOCKET CLOSED');
      socketRef.current = null;
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  /* ================= SEND (sess_id GUARANTEED) ================= */

  const send = (payload: any) => {
    const socket = socketRef.current;

    // 🔒 NORMALIZE PAYLOAD FOR BACKEND
    // Backend expects `sess_id`
    const normalizedPayload = {
      ...payload,
      sess_id:
        payload?.sess_id ??
        payload?.user_id ??
        payload?.session_id ??
        undefined,
    };

    const data = JSON.stringify(normalizedPayload);

    if (!socket) {
      console.warn('ADMIN SOCKET NOT CREATED → queueing', normalizedPayload);
      pendingQueueRef.current.push(data);
      return;
    }

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(data);
    } else {
      console.warn('ADMIN SOCKET NOT OPEN → queueing', normalizedPayload);
      pendingQueueRef.current.push(data);
    }
  };

  /* ================= EVENTS ================= */

  const onEvent = (cb: (data: any) => void) => {
    listenersRef.current.push(cb);
    return () => {
      listenersRef.current = listenersRef.current.filter((c) => c !== cb);
    };
  };

  const removeAlert = (sessionId: number) => {
    setAlerts((prev) => prev.filter((a) => a.session_id !== sessionId));
  };

  return (
    <AdminSocketContext.Provider
      value={{ send, alerts, removeAlert, onEvent }}
    >
      {children}
    </AdminSocketContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAdminSocket = () => {
  const ctx = useContext(AdminSocketContext);
  if (!ctx) {
    throw new Error('useAdminSocket must be used inside AdminSocketProvider');
  }
  return ctx;
};
