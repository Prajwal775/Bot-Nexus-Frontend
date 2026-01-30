import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { showGlobalToast } from '@/components/ui/ToastProvider';

const AddManualQA: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
const normalizeText = (text: string) =>
  text.replace(/\s*\n\s*/g, ' ').trim();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const cleanQuestion = normalizeText(question);
  const cleanAnswer = normalizeText(answer);

  if (!cleanQuestion || !cleanAnswer) {
    showGlobalToast('Question and Answer are required', 'warning');
    return;
  }

  try {
    setLoading(true);

    await api.post('/api/v1/knowledge-base/qa', {
      question: cleanQuestion,
      answer: cleanAnswer,
    });

    showGlobalToast('Manual Q&A saved successfully', 'success');
    navigate('/knowledge-base');
  } catch (err) {
    console.error(err);
    showGlobalToast('Failed to save Manual Q&A', 'error');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto w-full px-8 py-8">
      {/* Back */}
      <nav className="mb-4">
        <button
          onClick={() => navigate('/knowledge-base')}
          className="inline-flex items-center gap-2 text-[#ab9db9] hover:text-white text-sm font-medium transition-colors group"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Back to Knowledge Base
        </button>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h2 className="text-white text-3xl font-black tracking-tight">
          Add Manual Q&A
        </h2>
        <p className="text-[#ab9db9] text-sm mt-1">
          Directly add specific answers to common customer queries.
        </p>
      </header>

      {/* Form */}
      <div className="bg-card-dark border border-border-dark rounded-xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#ab9db9] uppercase tracking-wider">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="How does a user reset their password?"
              className="bg-background-dark border-border-dark rounded-lg text-sm text-white p-4 resize-none placeholder:text-[#50455e]"
            />
            <p className="text-[10px] text-[#50455e]">
              Enter the typical question a user might ask.
            </p>
          </div>

          {/* Answer */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#ab9db9] uppercase tracking-wider">
              Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={10}
              placeholder="To reset your password, click on 'Forgot Password' on the login screen..."
              className="bg-background-dark border-border-dark rounded-lg text-sm text-white p-4 resize-none placeholder:text-[#50455e]"
            />
            <p className="text-[10px] text-[#50455e]">
              Provide a clear, detailed response. Markdown is supported.
            </p>
          </div>

          <div className="h-px bg-border-dark" />

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/knowledge-base')}
              className="px-6 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-[#ab9db9] hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              {loading ? 'Saving…' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* Pro Tip */}
      <div className="mt-8 flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <span className="material-symbols-outlined text-primary text-xl">
          lightbulb
        </span>
        <div className="text-[12px] text-[#ab9db9] leading-relaxed">
          <p className="font-bold text-white mb-0.5">Pro Tip</p>
          Manual entries take precedence over automated sources (crawls/PDFs).
          Use them to override AI hallucinations or provide specific company
          policy updates.
        </div>
      </div>
    </div>
  );
};

export default AddManualQA;
