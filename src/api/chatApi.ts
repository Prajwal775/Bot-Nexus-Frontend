import api from './axios';
import { AxiosRequestConfig } from 'axios';

/**
 * Chat / QA API
 * POST /api/v1/qa
 */
export const askQuestionApi = async (
  question: string,
  sessionId: number,
  config?: AxiosRequestConfig
) => {
  const { data } = await api.post(
    '/api/v1/qa',
    {
      question,
      user_id: sessionId, // integer-only session
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      ...config, // 👈 allow signal, timeout, etc.
    }
  );

  return data;
};
