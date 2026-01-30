import { createContext, useContext, useEffect, useState } from 'react';

type ChatState = {
  isOpen: boolean;
  sessionId: number | null;
};

type ChatContextType = {
  chatState: ChatState;
  openChat: () => void;
  closeChat: () => void;
  resetSession: () => void; // 👈 NEW
};

const ChatContext = createContext<ChatContextType | null>(null);

const SESSION_KEY = 'botnexus_chat_session_id';

/**
 * PROD-SAFE integer-only session generator
 */
function generateSessionId(): number {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return Number(`${now}${random}`);
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    sessionId: null,
  });

  const createNewSession = () => {
    const sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId.toString());
    return sessionId;
  };

  useEffect(() => {
  const clearOnReload = () => {
    sessionStorage.removeItem(SESSION_KEY);
  };

  window.addEventListener('beforeunload', clearOnReload);
  return () => window.removeEventListener('beforeunload', clearOnReload);
}, []);

  /* ================= INIT SESSION ================= */
  useEffect(() => {
    let stored = sessionStorage.getItem(SESSION_KEY);

    if (!stored) {
      stored = createNewSession().toString();
    }

    setChatState(prev => ({
      ...prev,
      sessionId: Number(stored),
    }));
  }, []);

  /* ================= API ================= */
  const openChat = () => {
    setChatState(prev => ({ ...prev, isOpen: true }));
  };

  const closeChat = () => {
    setChatState(prev => ({ ...prev, isOpen: false }));
  };

  const resetSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    const newSessionId = createNewSession();

    setChatState({
      isOpen: false,
      sessionId: newSessionId,
    });
  };

  return (
    <ChatContext.Provider
      value={{ chatState, openChat, closeChat, resetSession }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
};
