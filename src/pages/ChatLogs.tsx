import api from '@/api/axios';

import React, { useEffect, useRef, useState } from 'react';
import { Session } from 'types';
import { DayPicker } from 'react-day-picker';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const PAGE_LIMIT = 10;

// const ChatLogs: React.FC<ChatLogsProps> = ({ onSelectSession }) => {
const ChatLogs: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchSessionId, setSearchSessionId] = useState('');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'ai' | 'human' | 'human + ai'
  >('all');

  // Date range (optional)
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  // Dropdown states
  const [showCalendar, setShowCalendar] = useState(false);
  const [showType, setShowType] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  //pagination states
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const navigate = useNavigate();

  const TYPE_LABELS: Record<string, string> = {
    all: 'All Sessions',
    ai: 'AI Only',
    'human + ai': 'AI + Human',
  };

  const handleRefresh = () => {
    setSearchSessionId('');
    setTypeFilter('all');
    setFromDate(null);
    setToDate(null);
    setPage(1);
  };

  useEffect(() => {
    fetchChatLogs();
  }, [page, typeFilter, fromDate, toDate, debouncedSearch]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setShowType(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const fetchChatLogs = async () => {
    const params: any = {
      skip: (page - 1) * PAGE_LIMIT,
      limit: PAGE_LIMIT,
    };
    if (debouncedSearch) params.session_id = debouncedSearch;
    if (typeFilter !== 'all') params.type = typeFilter;
    if (fromDate && toDate) {
      params.start_date = fromDate;
      params.end_date = toDate;
    }

    const res = await api.get('/api/v1/chat/summary', { params });
    const rows = res.data?.data || [];
    setTotal(res.data?.total || 0);

    setSessions(
      rows.map((item: any) => {
        const rawSessionId = String(item.session_id).replace(/^SESS-/, '');

        return {
          id: rawSessionId, // ✅ CLEAN ID (no SESS-)
          displayId: `#${rawSessionId}`, // UI-only

          startTime: new Date(item.start_time).toLocaleString(),
          duration: `${Math.floor(item.duration_seconds / 60)}m ${
            item.duration_seconds % 60
          }s`,
          type:
            item.type === 'ai'
              ? 'AI Only'
              : item.type === 'human + ai'
              ? 'AI + Human'
              : 'AI + Human',
          status:
            item.status === 'completed'
              ? 'Resolved'
              : item.status === 'active'
              ? 'Active'
              : 'Pending Intervention',
          userName: '',
          lastMessage: '',
          timeAgo: '',
        };
      })
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchSessionId.trim());
      setPage(1); // reset pagination on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchSessionId]);

  const defaultFrom = startOfMonth(new Date());
  const defaultTo = endOfMonth(new Date());

  const dateLabel =
    fromDate && toDate
      ? `${format(new Date(fromDate), 'dd MMM')} - ${format(
          new Date(toDate),
          'dd MMM'
        )}`
      : `${format(defaultFrom, 'dd MMM')} - ${format(defaultTo, 'dd MMM')}`;

  return (
    <div className='flex-1 flex flex-col h-full overflow-hidden'>
      {/* ===== HEADER UNCHANGED ===== */}
      <header className='p-8 pb-0 shrink-0'>
        <div className='flex flex-wrap justify-between items-end gap-4'>
          <div className='flex flex-col gap-1'>
            <h2 className='text-3xl font-black tracking-tight'>Chat Logs</h2>
            <p className='text-[#ab9db9]'>
              Monitor and manage all AI and human-led chat sessions
            </p>
          </div>
          <div className='flex gap-3'>
            {/* <button className='flex items-center gap-2 h-10 px-4 bg-white/5 border border-border-dark hover:bg-white/10 rounded-lg text-sm font-bold'>
              <span className='material-symbols-outlined'>download</span>
              Export Logs
            </button> */}
            <button
              onClick={handleRefresh}
              className='flex items-center gap-2 h-10 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-bold'
            >
              <span className='material-symbols-outlined'>refresh</span>
              Refresh
            </button>
          </div>
        </div>

        {/* ===== FILTER BAR UNCHANGED ===== */}
        <div className='mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center'>
          <div className='lg:col-span-5'>
            <label className='relative block h-11 w-full'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-[#ab9db9]'>
                <span className='material-symbols-outlined'>search</span>
              </span>
              <input
                value={searchSessionId}
                onChange={(e) => setSearchSessionId(e.target.value)}
                // onKeyDown={(e) => e.key === 'Enter' && fetchChatLogs()}
                className='block w-full h-full pl-11 pr-4 bg-card-dark rounded-lg text-sm placeholder-[#ab9db9]'
                placeholder='Search by Session ID or user name...'
              />
            </label>
          </div>

          <div className='lg:col-span-7 flex flex-wrap gap-2 justify-end'>
            {/* DATE RANGE */}
            <div className='relative' ref={calendarRef}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                // className='flex items-center gap-2 h-11 px-4 bg-card-dark rounded-lg text-sm font-medium'
                className='flex items-center gap-2 h-11 px-4 bg-card-dark border border-border-dark hover:bg-white/5 rounded-lg text-sm font-medium'
              >
                {/* <span className='material-symbols-outlined text-[#ab9db9]'> */}
                <span className='material-symbols-outlined text-gray-300'>
                  calendar_today
                </span>

                <span>{dateLabel}</span>
                <span className='material-symbols-outlined text-[#ab9db9]'>
                  expand_more
                </span>
              </button>
              {showCalendar && (
                <div
                  className='absolute right-0 mt-2 rounded-xl p-4 z-50 shadow-2xl'
                  style={{
                    // backgroundColor: '#1c1f2a',
                    // border: '1px solid #2b2f3f',
                    backgroundColor: '#262a3b', // ⬅️ lighter than before
                    border: '1px solid #353a52',
                  }}
                >
                  <DayPicker
                    mode='range'
                    selected={{
                      from: fromDate ? new Date(fromDate) : undefined,
                      to: toDate ? new Date(toDate) : undefined,
                    }}
                    onSelect={(range) => {
                      if (!range) return;
                      if (range.from)
                        setFromDate(format(range.from, 'yyyy-MM-dd'));
                      if (range.to) setToDate(format(range.to, 'yyyy-MM-dd'));
                    }}
                    className='text-sm'
                    modifiersClassNames={{
                      selected: 'bg-[#7c3aed] text-white',
                      today: 'text-[#a78bfa] font-semibold',
                      outside: 'text-[#6b7280]',
                    }}
                    styles={{
                      root: { color: '#e5e7eb' },

                      caption: {
                        color: '#ffffff',
                        fontWeight: 600,
                      },

                      head_cell: { color: '#9ca3af' },

                      day: {
                        color: '#e5e7eb',
                        borderRadius: '6px',
                      },

                      /* IMPORTANT PART */
                      nav: {
                        backgroundColor: 'transparent',
                      },

                      nav_button: {
                        color: '##f9fafb ',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',

                        opacity: 1,
                      },

                      day_selected: {
                        backgroundColor: '#7c3aed',
                        color: '#ffffff',
                      },

                      day_range_middle: {
                        backgroundColor: '#312e81',
                        color: '#e5e7eb',
                      },
                    }}
                  />
                </div>
              )}
            </div>
            {/* TYPE */}
            <div className='relative' ref={typeRef}>
              <button
                onClick={() => setShowType(!showType)}
                className='flex items-center gap-2 h-11 px-4 bg-card-dark rounded-lg text-sm font-medium'
              >
                <span>Type: {TYPE_LABELS[typeFilter]}</span>
                <span className='material-symbols-outlined text-[#ab9db9]'>
                  expand_more
                </span>
              </button>

              {showType && (
                <div className='absolute right-0 mt-2 bg-card-dark border border-border-dark rounded-xl overflow-hidden z-50'>
                  {(['all', 'ai', 'human + ai'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTypeFilter(t as any);
                        setShowType(false);
                      }}
                      className='block w-full px-4 py-2 text-left hover:bg-white/5'
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== TABLE CARD UNCHANGED ===== */}
      <div className='flex-1 p-8 overflow-hidden flex flex-col'>
        <div className='bg-card-dark rounded-xl border border-border-dark flex-1 flex flex-col overflow-hidden'>
          <div className='overflow-x-auto flex-1'>
            <table className='w-full text-left border-collapse min-w-[900px]'>
              <thead>
                <tr className='border-b border-border-dark bg-white/5'>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]'>
                    Session ID
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]'>
                    Start Time
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]'>
                    Duration
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]'>
                    Type
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9]'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#ab9db9] text-right'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-border-dark'>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className='hover:bg-primary/5 transition-colors'
                  >
                    <td className='px-6 py-4 font-mono'>{session.displayId}</td>
                    <td className='px-6 py-4'>{session.startTime}</td>
                    <td className='px-6 py-4'>{session.duration}</td>
                    <td className='px-6 py-4 flex items-center gap-2'>
                      <span
                        className={`material-symbols-outlined ${
                          session.type === 'AI Only'
                            ? 'text-primary'
                            : session.type === 'Human Only'
                            ? 'text-blue-400'
                            : 'text-purple-400'
                        }`}
                      >
                        {session.type === 'AI Only'
                          ? 'smart_toy'
                          : session.type === 'Human Only'
                          ? 'person'
                          : 'mediation'}
                      </span>
                      {session.type}
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : session.status === 'Active'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            session.status === 'Resolved'
                              ? 'bg-emerald-400'
                              : session.status === 'Active'
                              ? 'bg-blue-400 animate-pulse'
                              : 'bg-amber-400 animate-pulse'
                          }`}
                        />
                        {session.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <button
                        onClick={() => navigate(`/chat-logs/${session.id}`)}
                        className='text-primary font-bold hover:underline'
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className='p-6 border-t border-border-dark bg-white/5 flex items-center justify-between'>
            {/* Left: info */}
            <p className='text-sm text-[#ab9db9]'>
              Showing{' '}
              <span className='font-bold text-white'>
                {(page - 1) * PAGE_LIMIT + 1}
              </span>{' '}
              to{' '}
              <span className='font-bold text-white'>
                {Math.min(page * PAGE_LIMIT, total)}
              </span>{' '}
              of <span className='font-bold text-white'>{total}</span> sessions
            </p>

            {/* Right: pagination */}
            <div className='flex items-center gap-2'>
              {/* Prev */}
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className='size-9 flex items-center justify-center rounded-lg border border-border-dark hover:bg-white/5 disabled:opacity-40'
              >
                <span className='material-symbols-outlined'>chevron_left</span>
              </button>

              {/* Page indicator */}
              <span className='text-sm font-bold text-white'>{page}</span>

              {/* Next */}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className='size-9 flex items-center justify-center rounded-lg border border-border-dark hover:bg-white/5 disabled:opacity-40'
              >
                <span className='material-symbols-outlined'>chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLogs;
