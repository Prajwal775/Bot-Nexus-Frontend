import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { askQuestionApi } from '@/api/chatApi';

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

const WELCOME_MESSAGE =
  "Hi there! I'm your Nexus assistant. How can I help you build your identity today?";

const normalizeText = (text: string) => text.replace(/\s*\n\s*/g, ' ').trim();

const ChatWidget: React.FC = () => {
  const { chatState, openChat, closeChat, resetSession } = useChat();
  const { isOpen, sessionId } = chatState;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ================= INIT WELCOME ================= */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    }
  }, [messages.length]);

  /* ================= AUTOSCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!input.trim() || !sessionId || isTyping) return;

    const cleanInput = normalizeText(input);

    const userMessage: Message = {
      role: 'user',
      content: cleanInput,
    };

    // Optimistic UI
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Cancel previous request if any
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await askQuestionApi(cleanInput, sessionId, {
        signal: controller.signal,
        timeout: 15000, // ⏱️ HARD timeout
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res?.answer || 'Sorry, I could not generate a response.',
        },
      ]);
    } catch (err: any) {
      if (err.name === 'CanceledError') return;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            err.code === 'ECONNABORTED'
              ? 'The request took too long. Please try again.'
              : 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ================= HARD CLOSE ================= */
  const handleHardClose = () => {
    abortRef.current?.abort();
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    resetSession(); // 👈 single source of truth
  };

  /* ================= MINIMIZE ================= */
  const handleMinimize = () => {
    closeChat(); // UI only
  };

  return (
    <div className='fixed bottom-6 right-6 flex flex-col items-end gap-4 z-50'>
      {isOpen && (
        <div className='w-[400px] h-[600px] bg-[#1f1629] rounded-xl flex flex-col overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-white/10 animate-in slide-in-from-bottom-5 duration-300'>
          {/* HEADER */}
          <header className='bg-gradient-to-br from-primary to-purple-600 p-6 flex justify-between items-center text-white'>
            <h2 className='font-bold text-lg'>BotNexus Support</h2>
            <button onClick={handleMinimize} title='Minimize'>
              <span className='material-symbols-outlined'>minimize</span>
            </button>
          </header>

          {/* CHAT BODY */}
          <div className='flex-1 overflow-y-auto p-4 space-y-6'>
            {messages.map((msg, i) =>
              msg.role === 'assistant' ? (
                <div key={i} className='flex gap-3'>
                  <div
                    className='w-8 h-8 rounded-full bg-cover shrink-0'
                    style={{
                      backgroundImage:
                        'url("https://picsum.photos/id/102/100/100")',
                    }}
                  />
                  <div className='max-w-[280px] rounded-xl rounded-bl-none px-4 py-3 bg-[#302839] text-white text-sm'>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className='flex justify-end'>
                  <div className='max-w-[280px] rounded-xl rounded-br-none px-4 py-3 bg-primary text-white text-sm'>
                    {msg.content}
                  </div>
                </div>
              )
            )}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className='flex gap-3'>
                <div
                  className='w-8 h-8 rounded-full bg-cover'
                  style={{
                    backgroundImage:
                      'url("https://picsum.photos/id/102/100/100")',
                  }}
                />
                <div className='rounded-xl px-4 py-3 bg-[#302839] text-white text-sm flex gap-1'>
                  <span className='animate-bounce'>•</span>
                  <span className='animate-bounce [animation-delay:0.15s]'>
                    •
                  </span>
                  <span className='animate-bounce [animation-delay:0.3s]'>
                    •
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className='p-4 border-t border-white/10 bg-white/5'>
            <div className='flex gap-2'>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder='Type your question...'
                className='flex-1 bg-[#302839] text-white px-4 rounded-xl text-sm focus:outline-none'
                disabled={isTyping}
              />

              <button
                onClick={sendMessage}
                disabled={isTyping || !input.trim()}
                className='size-12 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center disabled:opacity-50'
              >
                <span className='material-symbols-outlined'>send</span>
              </button>
            </div>

            <p className='text-center text-[10px] text-[#ab9db9] mt-3'>
              Powered by BotNexus AI
            </p>
          </div>
        </div>
      )}

      {/* FLOAT BUTTON */}
      <button
        onClick={isOpen ? handleHardClose : openChat}
        className='bg-gradient-to-r from-primary to-purple-500 size-16 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all'
      >
        <span className='material-symbols-outlined text-3xl'>
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>
    </div>
  );
};

export default ChatWidget;
