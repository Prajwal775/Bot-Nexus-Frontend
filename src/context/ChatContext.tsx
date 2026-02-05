import { createContext, useContext, useEffect, useState } from 'react';
import { useUserSocket } from '../hooks/useUserSocket';

/* ================= TYPES ================= */

type ChatMode = 'bot' | 'waiting_human' | 'human';

type ChatMessage = {
  sender: 'user' | 'bot' | 'agent' | 'system';
  text: string;
};

type ChatState = {
  isOpen: boolean;
  sessionId: number | null;
  mode: ChatMode;
  messages: ChatMessage[];
};

type ChatContextType = {
  chatState: ChatState;
  openChat: () => void;
  closeChat: () => void;
  resetSession: () => void;
  sendMessage: (message: string) => void;
  addBotMessage: (text: string) => void;
  requestHuman: () => void;
};

/* ================= CONTEXT ================= */

const ChatContext = createContext<ChatContextType | null>(null);

/* ================= SESSION ID ================= */

function generateSessionId(): number {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return Number(`${now}${random}`);
}

/* ================= PROVIDER ================= */

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    sessionId: null,
    mode: 'bot',
    messages: [
      {
        sender: 'bot',
        text: "Hi there! I'm your Nexus assistant. How can I help you build your identity today?",
      },
    ],
  });

  /* ================= INIT SESSION ================= */
  useEffect(() => {
    const sessionId = generateSessionId();
    setChatState((prev) => ({
      ...prev,
      sessionId,
    }));
  }, []);

  /* ================= SOCKET ================= */
  const { sendMessage: sendSocketMessage, requestHuman } = useUserSocket(
    chatState.sessionId,
    {
      // onHumanAlert: (message?: string) => {
      //   setChatState((prev) => ({
      //     ...prev,
      //     mode: 'waiting_human',
      //     ...(message
      //       ? {
      //           messages: [
      //             ...prev.messages,
      //             {
      //               sender: 'system',
      //               text: message, 
      //             },
      //           ],
      //         }
      //       : {}),
      //   }));
      // },
onHumanAlert: (message?: string) => {
  setChatState((prev) => {
    // 🔒 HARD DEDUPE: if message already exists, do NOTHING
    if (
      message &&
      prev.messages.some(
        (m) => m.text === message
      )
    ) {
      return prev;
    }

    return {
      ...prev,
      mode: 'waiting_human',
      ...(message
        ? {
            messages: [
              ...prev.messages,
              {
                sender: 'system', // 🔥 ONLY system
                text: message,
              },
            ],
          }
        : {}),
    };
  });
},

      onAgentJoined: (message?: string) => {
        setChatState((prev) => ({
          ...prev,
          mode: 'human',
          ...(message
            ? {
                messages: [
                  ...prev.messages,
                  {
                    sender: 'system',
                    text: message, // 🔥 ONLY from socket
                  },
                ],
              }
            : {}),
        }));
      },

      onAgentMessage: (message: string) => {
        setChatState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              sender: 'agent',
              text: message,
            },
          ],
        }));
      },
    }
  );

  /* ================= HELPERS ================= */

  const addBotMessage = (text: string) => {
    setChatState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          sender: 'bot',
          text,
        },
      ],
    }));
  };

  const sendMessage = (message: string) => {
    // Always show user message in UI
    setChatState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          sender: 'user',
          text: message,
        },
      ],
    }));

    // Only send to socket after escalation
    if (chatState.mode !== 'bot') {
      sendSocketMessage(message);
    }
  };

  /* ================= UI API ================= */

  const openChat = () => {
    setChatState((prev) => ({ ...prev, isOpen: true }));
  };

  const closeChat = () => {
    setChatState((prev) => ({ ...prev, isOpen: false }));
  };

  const resetSession = () => {
    const newSessionId = generateSessionId();
    setChatState({
      isOpen: false,
      sessionId: newSessionId,
      mode: 'bot',
      messages: [
        {
          sender: 'bot',
          text: "Hi there! I'm your Nexus assistant. How can I help you build your identity today?",
        },
      ],
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chatState,
        openChat,
        closeChat,
        resetSession,
        sendMessage,
        addBotMessage,
        requestHuman,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat must be used inside ChatProvider');
  }
  return ctx;
};
