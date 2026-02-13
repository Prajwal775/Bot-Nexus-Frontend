import axios from '@/api/axios';
import React, { useEffect, useState } from 'react';
import { useAdminSocket } from '@/context/AdminSocketContext';
import { useParams, useNavigate } from 'react-router-dom';

interface ChatDetailsProps {
  // sessionId?: number;
  readOnly?: boolean;
}

type SupportAlert = {
  session_id: string; // backend session id
  sess_id: number; // USER ID (primary chat identity)
  created_at: string;
};

type ChatMessage = {
  role: 'user' | 'bot' | 'agent';
  content: string;
  needs_human?: boolean;
  sender_name?: string;
  timestamp?: string;
};

// const ChatDetails: React.FC<ChatDetailsProps> = () => {
const ChatDetails: React.FC<ChatDetailsProps> = ({ readOnly = false }) => {
  const [alerts, setAlerts] = useState<SupportAlert[]>([]);
  const [activeAlert, setActiveAlert] = useState<SupportAlert | null>(null);
  const [loadingTakeover, setLoadingTakeover] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [composerText, setComposerText] = useState('');
  const { sessionId } = useParams<{ sessionId: string }>();
  const parsedSessionId = sessionId;
  const navigate = useNavigate();

  const {
    send: adminSend,
    alerts: socketAlerts,
    removeAlert,
    onEvent,
  } = useAdminSocket();

  const agentId = Number(localStorage.getItem('user_id'));

  /* ================= PERSIST / RESTORE ================= */

  const persistMessages = (sessId: number, msgs: ChatMessage[]) => {
    localStorage.setItem(`chat_messages_${sessId}`, JSON.stringify(msgs));
  };

  const restoreLastChatFromStorage = () => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith('chat_messages_')
    );
    if (keys.length === 0) return;

    const lastKey = keys[keys.length - 1];
    const raw = localStorage.getItem(lastKey);
    if (!raw) return;

    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return;

    const sessId = Number(lastKey.replace('chat_messages_', ''));
    if (!sessId) return;

    setMessages(parsed);

    setActiveAlert({
      sess_id: sessId,
      session_id: String(sessId),
      created_at: new Date().toISOString(),
    });
  };

  //close session function
  const closeSession = () => {
    if (!activeAlert) return;

    const sessId = activeAlert.sess_id;

    // 1️⃣ Remove messages for this session
    localStorage.removeItem(`chat_messages_${sessId}`);

    // 2️⃣ Remove from chat_sessions list (if you maintain one)
    const rawSessions = localStorage.getItem('chat_sessions');
    if (rawSessions) {
      try {
        const parsed = JSON.parse(rawSessions) as number[];
        const updated = parsed.filter((id) => id !== sessId);
        localStorage.setItem('chat_sessions', JSON.stringify(updated));
      } catch {
        // ignore corrupted storage
      }
    }

    // 3️⃣ Clear UI state
    setMessages([]);
    setComposerText('');
    setActiveAlert(null);

    // 4️⃣ (Optional but recommended) tell socket/backend
    adminSend({
      type: 'close_session',
      sess_id: sessId,
    });
  };

  /* ================= LOAD ALERTS (API) ================= */

  useEffect(() => {
    if (readOnly) return; // 🔒 skip in chat logs

    axios
      .get<SupportAlert[]>('/api/v1/support-alerts')
      .then((res) => setAlerts(res.data))
      .catch(() => {});
  }, [readOnly]);

  /* ================= MERGE SOCKET ALERTS ================= */

  useEffect(() => {
    // if (!socketAlerts.length) return;
    if (readOnly || !socketAlerts.length) return;

    setAlerts((prev) => {
      const existing = new Set(prev.map((p) => p.sess_id));
      const merged = [...prev];

      socketAlerts.forEach((a) => {
        if (!existing.has(a.user_id)) {
          merged.push({
            session_id: String(a.session_id),
            sess_id: a.user_id,
            created_at: new Date().toISOString(),
          });
        }
      });

      return merged;
    });
  }, [readOnly, socketAlerts]);

  /* ================= RESTORE CHAT ON REFRESH ================= */

  useEffect(() => {
    if (readOnly) return; // 🔒 skip in chat logs

    if (!activeAlert && messages.length === 0) {
      restoreLastChatFromStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);

  /* ================= TAKEOVER ================= */

  const handleTakeover = async (alert: SupportAlert) => {
    try {
      setLoadingTakeover(alert.sess_id);

      await axios.post('/api/v1/support/takeover', null, {
        params: {
          sess_id: alert.sess_id,
          agent_id: agentId,
        },
      });

      const res = await axios.get(`/api/v1/messages/${alert.sess_id}`);
      const normalized: ChatMessage[] = res.data.map((m: any) => ({
        role: m.role ?? 'user',
        content: m.content ?? '',
        needs_human: !!m.needs_human,
        sender_name: m.sender_name,
        timestamp: m.created_at,
      }));

      setMessages(normalized);
      persistMessages(alert.sess_id, normalized);
      setActiveAlert(alert);
      setAlerts((prev) => prev.filter((a) => a.sess_id !== alert.sess_id));

      adminSend({ type: 'takeover', sess_id: alert.sess_id });
    } finally {
      setLoadingTakeover(null);
    }
  };

  /* ================= SEND REPLY ================= */
  const sendReply = () => {
    if (readOnly) return;

    if (!composerText.trim() || !activeAlert) return;

    adminSend({
      type: 'reply',
      sess_id: activeAlert.sess_id, // ✅ ONLY THIS
      message: composerText.trim(),
    });

    const msg: ChatMessage = {
      role: 'agent',
      content: composerText.trim(),
      sender_name: 'You',
      timestamp: new Date().toISOString(),
    };

    const next = [...messages, msg];
    setMessages(next);
    persistMessages(activeAlert.sess_id, next);
    setComposerText('');
  };

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    if (readOnly) return; // 🔒 NO SOCKETS in chat logs
    const unsub = onEvent((data: any) => {
      const sessId = Number(data.sess_id);
      if (!sessId) return;

      const currentSessId = activeAlert?.sess_id;

      if (data.type === 'user_message' || data.type === 'agent_message') {
        const chatMsg: ChatMessage = {
          role: data.type === 'user_message' ? 'user' : 'agent',
          content: data.message,
          sender_name:
            data.type === 'agent_message'
              ? `Agent ${data.agent_id ?? ''}`
              : 'User',
          timestamp: new Date().toISOString(),
        };

        if (currentSessId && sessId === currentSessId) {
          setMessages((prev) => {
            const nm = [...prev, chatMsg];
            persistMessages(currentSessId, nm);
            return nm;
          });
        } else {
          const key = `chat_messages_${sessId}`;
          const raw = localStorage.getItem(key);
          const arr = raw ? JSON.parse(raw) : [];
          arr.push(chatMsg);
          localStorage.setItem(key, JSON.stringify(arr));
        }
      }

      if (data.type === 'taken_over' && data.sess_id) {
        removeAlert(data.sess_id);
      }
    });

    return unsub;
  }, [readOnly, activeAlert, onEvent, removeAlert]);

  useEffect(() => {
    if (!readOnly || !parsedSessionId) return;

    (async () => {
      const res = await axios.get(`/api/v1/messages/${parsedSessionId}`);
      const normalized = res.data.map((m: any) => ({
        role: m.role ?? 'user',
        content: m.content ?? '',
        needs_human: !!m.needs_human,
        sender_name: m.sender_name,
        timestamp: m.created_at,
      }));

      setMessages(normalized);
      setActiveAlert({
        sess_id: 0,
        session_id: parsedSessionId,
        created_at: new Date().toISOString(),
      });
    })();
  }, [readOnly, parsedSessionId]);

  /* ================= UI ================= */

  const showHumanHandover = messages.some((m) => m.needs_human);

  return (
    <div className='flex-1 flex bg-[#191022] overflow-hidden'>
      {/* Chat Area */}
      <section className='flex-1 flex flex-col bg-[#191022] min-w-0'>
        {!activeAlert ? (
          alerts.length === 0 ? (
            // ✅ FULL PAGE EMPTY STATE
            <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
              <h1 className='text-white text-xl font-bold mb-4'>
                Pending Handover Requests
              </h1>

              <p className='text-lg font-semibold text-[#ab9db9]'>
                No active chat
              </p>
              <p className='text-sm text-[#ab9db9] mt-1'>
                No pending handover requests
              </p>
            </div>
          ) : (
            // ✅ LIST VIEW (when alerts exist)
            <div className='flex-1 overflow-y-auto p-8'>
              <h1 className='text-white text-xl font-bold mb-6'>
                Pending Handover Requests
              </h1>

              <div className='space-y-3'>
                {alerts.map((alert) => (
                  <div
                    key={alert.sess_id}
                    className='flex items-center justify-between gap-4 px-5 py-3 rounded-lg border border-border-dark bg-[#191022] hover:border-primary/40 transition'
                  >
                    <div className='flex items-center gap-6 min-w-0'>
                      <span className='text-sm font-bold text-white whitespace-nowrap'>
                        Session #{alert.session_id}
                      </span>

                      <span className='text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap'>
                        Handover
                      </span>

                      <span className='text-sm text-white truncate'>
                        User ID: {alert.sess_id}
                      </span>

                      <span className='text-xs text-[#ab9db9] whitespace-nowrap'>
                        Awaiting agent takeover
                      </span>
                    </div>

                    <button
                      onClick={() => handleTakeover(alert)}
                      disabled={loadingTakeover === alert.sess_id}
                      className='shrink-0 bg-primary text-white text-xs font-bold px-5 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50'
                    >
                      {loadingTakeover === alert.sess_id
                        ? 'Taking over…'
                        : 'Takeover'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <>
            <header className='flex flex-wrap justify-between items-center gap-3 p-6 border-b border-border-dark'>
              <div className='flex items-center gap-4'>
                <div className='size-12 rounded-full bg-[#302839] flex items-center justify-center text-primary'>
                  <span className='material-symbols-outlined size-6'>
                    person
                  </span>
                </div>
                <div className='flex flex-col'>
                  <p className='text-white text-xl font-bold leading-tight'>
                    Session {activeAlert?.session_id}
                  </p>
                </div>
              </div>
              <div className='flex gap-2'>
                {/* ✅ BACK BUTTON (only in readOnly mode) */}
                {readOnly && (
                  <button
                    onClick={() => navigate('/chat-logs')}
                    className='flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20'
                  >
                    <span className='material-symbols-outlined mr-2 text-lg'>
                      arrow_back
                    </span>
                    Back
                  </button>
                )}

                <button
                  onClick={readOnly ? undefined : closeSession}
                  disabled={readOnly}
                  className='flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20'
                >
                  <span className='material-symbols-outlined mr-2 text-lg'>
                    check_circle
                  </span>
                  Close Session
                </button>
              </div>
            </header>

            {/* Tabs */}
            <div className='flex border-b border-border-dark px-6 gap-8 bg-transparent'>
              <button className='flex flex-col items-center justify-center pb-3 pt-4 border-b-2 transition-colors border-primary text-white font-bold'>
                <p className='text-sm tracking-[0.015em]'>All Messages</p>
              </button>
            </div>

            {/* Message History */}
            <div className='flex-1 overflow-y-auto p-6 space-y-6'>
              {messages.length === 0 ? (
                <div className='text-[#ab9db9] text-sm'>No messages yet</div>
              ) : (
                messages.map((m, i) => (
                  <React.Fragment key={`frag-${i}`}>
                    {m.role === 'user' ? (
                      <div className='flex items-start gap-3'>
                        <div className='bg-[#302839] size-8 rounded-full flex items-center justify-center text-[#ab9db9] mt-1 shrink-0'>
                          <span className='material-symbols-outlined text-sm'>
                            person
                          </span>
                        </div>
                        <div className='flex flex-col gap-1 items-start max-w-[70%]'>
                          <div className='flex items-center gap-2'>
                            <span className='text-white text-sm font-bold'>
                              {m.sender_name ?? 'User'}
                            </span>
                            <span className='text-[#6d5b7e] text-[10px]'>
                              {m.timestamp
                                ? new Date(m.timestamp).toLocaleTimeString()
                                : ''}
                            </span>
                          </div>
                          <p className='text-sm font-normal leading-relaxed rounded-2xl rounded-tl-none px-4 py-3 bg-[#302839] text-white'>
                            {m.content}
                          </p>
                        </div>
                      </div>
                    ) : m.role === 'bot' ? (
                      <div className='flex items-start gap-3 flex-row-reverse'>
                        <div className='bg-primary/20 text-primary aspect-square rounded-full w-8 shrink-0 flex items-center justify-center mt-1'>
                          <span className='material-symbols-outlined text-sm'>
                            smart_toy
                          </span>
                        </div>
                        <div className='flex flex-col gap-1 items-end max-w-[70%]'>
                          <div className='flex items-center gap-2'>
                            <span className='text-[#6d5b7e] text-[10px]'>
                              {m.timestamp
                                ? new Date(m.timestamp).toLocaleTimeString()
                                : ''}
                            </span>
                            <span className='text-xs font-bold text-white flex items-center'>
                              AI Assistant
                              <span className='ml-1.5 px-1 bg-primary/20 text-primary text-[9px] rounded font-black tracking-tighter uppercase'>
                                AI
                              </span>
                            </span>
                          </div>
                          <p className='text-sm font-normal leading-relaxed rounded-2xl rounded-tr-none px-4 py-3 bg-[#251e2e] border border-border-dark text-white'>
                            {m.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-start gap-3 flex-row-reverse'>
                        <div className='bg-primary size-8 rounded-full flex items-center justify-center text-white mt-1 shrink-0 border-2 border-primary'>
                          <span className='material-symbols-outlined text-sm'>
                            support_agent
                          </span>
                        </div>
                        <div className='flex flex-col gap-1 items-end max-w-[70%]'>
                          <div className='flex items-center gap-2'>
                            <span className='text-[#6d5b7e] text-[10px]'>
                              {m.timestamp
                                ? new Date(m.timestamp).toLocaleTimeString()
                                : ''}
                            </span>
                            <span className='text-xs font-bold text-primary'>
                              {m.sender_name ?? 'Agent'}
                            </span>
                          </div>
                          <p className='text-sm font-normal leading-relaxed rounded-2xl rounded-tr-none px-4 py-3 bg-primary text-white shadow-lg shadow-primary/20'>
                            {m.content}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* inline human handover chip */}
                    {m.needs_human && (
                      <div className='flex items-center justify-center py-4'>
                        <div className='flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400'>
                          <span className='material-symbols-outlined text-sm'>
                            hail
                          </span>
                          <span className='text-[11px] font-bold uppercase tracking-wider'>
                            Human Handover Requested
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>

            {/* Composer */}
            <div className='p-6 border-t border-border-dark bg-transparent'>
              <div className='relative bg-[#302839] rounded-xl border border-[#473b54] p-3 transition-all'>
                <textarea
                  disabled={readOnly}
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  className='w-full bg-transparent border-none focus:ring-0 text-white text-sm min-h-[80px] resize-none'
                  placeholder='Type your response as Alex...'
                ></textarea>
                <div className='flex justify-end items-center mt-2 px-2 pb-1'>
                  <button
                    disabled={readOnly}
                    onClick={sendReply}
                    className='bg-primary text-white rounded-lg px-6 py-2 text-sm font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all'
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default ChatDetails;
