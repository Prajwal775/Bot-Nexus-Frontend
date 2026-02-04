import { useEffect, useRef } from 'react';

/* ================= ENV → WS ================= */
function getWsBaseUrl(): string {
  const httpBase = import.meta.env.VITE_API_BASE_URL;
  if (!httpBase) throw new Error('VITE_API_BASE_URL missing');

  return httpBase.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');
}

type UserSocketEvents = {
  onHumanAlert?: (message?: string) => void;
  onAgentJoined?: (message?: string, agentId?: number) => void;
  onAgentMessage?: (message: string) => void;
  onBotMessage?: (message: string) => void;
};

export function useUserSocket(
  sessionId: number | null,
  events?: UserSocketEvents
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const wsUrl = `${getWsBaseUrl()}/ws/user/${sessionId}`;
    console.log('CONNECTING USER SOCKET →', wsUrl);

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('USER CONNECTED:', sessionId);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'human_alert':
            events?.onHumanAlert?.(data.message);
            break;

          case 'agent_joined':
            events?.onAgentJoined?.(data.message, data.agent_id);
            break;

          case 'agent_message':
            events?.onAgentMessage?.(data.message);
            break;

          case 'bot_message':
            events?.onBotMessage?.(data.message);
            break;

          default:
            console.log('USER SOCKET EVENT:', data);
        }
      } catch {
        console.log('USER RAW:', event.data);
      }
    };

    socket.onerror = (err) => {
      console.error('USER SOCKET ERROR:', err);
    };

    socket.onclose = () => {
      console.log('USER SOCKET CLOSED:', sessionId);
      socketRef.current = null;
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [sessionId]);

  /* ================= SEND ================= */

  const sendMessage = (message: string) => {
    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: 'message',
        message,
      })
    );
  };

  const requestHuman = () => {
    socketRef.current?.send(
      JSON.stringify({
        type: 'request_human',
      })
    );
  };

  return {
    sendMessage,
    requestHuman,
  };
}
