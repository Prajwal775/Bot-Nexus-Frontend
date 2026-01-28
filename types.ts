
export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
  ADD_MANUAL_QA = 'ADD_MANUAL_QA',
  CHAT_LOGS = 'CHAT_LOGS',
  CHAT_DETAILS = 'CHAT_DETAILS',
  SETTINGS = 'SETTINGS'
}

export interface NavItem {
  id: AppView;
  label: string;
  icon: string;
}

export interface Session {
  id: string;
  startTime: string;
  duration: string;
  type: 'AI Only' | 'Human Only' | 'AI + Human';
  status: 'Resolved' | 'Active' | 'Pending Intervention';
  userName: string;
  lastMessage: string;
  timeAgo: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'agent';
  text: string;
  timestamp: string;
  isThinking?: boolean;
}
