import api from '@/api/axios';

export interface KnowledgeItem {
  id: number;
  source_type: 'file' | 'url' | 'qa';
  source_url?: string;
  text_content?: string;
  original_filename?: string;
  content_type?: string;
  uploaded_at?: string;
  created_at: string;
}

export interface KnowledgeResponse {
  total: number;
  page: number;
  page_size: number;
  items: KnowledgeItem[];
}

export type KnowledgeApiSourceType = 'file' | 'kb_qa' | 'kb_url';

export const fetchKnowledgeBase = async (
  sourceType: KnowledgeApiSourceType
): Promise<KnowledgeResponse> => {
  const res = await api.get('/api/v1/knowledge-base', {
    params: {
      source_type: sourceType,
      page: 1,
      page_size: 100, //
    },
  });

  return res.data;
};
