import api from '@/api/axios';

export interface KnowledgeItem {
  id: number;
  source_type: 'file' | 'url' | 'qa';
  source_url?: string;
  text_content?: string;
  original_filename?: string;
  content_type?: string;
  uploaded_at?: string;
}

export interface KnowledgeResponse {
  total: number;
  page: number;
  page_size: number;
  items: KnowledgeItem[];
}

export const fetchKnowledgeBase = async (): Promise<KnowledgeResponse> => {
  const res = await api.get('/api/v1/knowledge-base');
  return res.data;
};
