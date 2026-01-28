
import React from 'react';

interface ManualQAProps {
  onBack: () => void;
}

const ManualQA: React.FC<ManualQAProps> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full px-8 py-8">
        <nav className="mb-4">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#ab9db9] hover:text-white text-sm font-medium transition-colors group"
          >
            <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
            Back to Knowledge Base
          </button>
        </nav>

        <header className="mb-8">
          <h2 className="text-white text-3xl font-black leading-tight tracking-tight">Add Manual Q&A</h2>
          <p className="text-[#ab9db9] text-sm font-normal mt-1">Directly add specific answers to common customer queries.</p>
        </header>

        <div className="bg-card-dark border border-border-dark rounded-xl p-8 shadow-2xl">
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onBack(); }}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#ab9db9] uppercase tracking-wider">Question</label>
              <textarea 
                className="bg-background-dark border-border-dark rounded-lg text-sm text-white focus:ring-primary p-4 placeholder:text-[#50455e] resize-none" 
                placeholder="How does a user reset their password?" 
                rows={3}
              ></textarea>
              <p className="text-[10px] text-[#50455e]">Enter the typical question a user might ask.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#ab9db9] uppercase tracking-wider">Answer</label>
              <textarea 
                className="bg-background-dark border-border-dark rounded-lg text-sm text-white focus:ring-primary p-4 placeholder:text-[#50455e] resize-none" 
                placeholder="To reset your password, click on 'Forgot Password' on the login screen. You will receive an email with instructions..." 
                rows={10}
              ></textarea>
              <p className="text-[10px] text-[#50455e]">Provide a clear, detailed response. Markdown is supported.</p>
            </div>

            <div className="h-px bg-border-dark w-full pt-2"></div>

            <div className="flex items-center justify-end gap-4">
              <button 
                type="button" 
                onClick={onBack}
                className="px-6 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-[#ab9db9] hover:bg-white/5 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                Save Entry
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <span className="material-symbols-outlined text-primary text-xl">lightbulb</span>
          <div className="text-[12px] text-[#ab9db9] leading-relaxed">
            <p className="font-bold text-white mb-0.5">Pro Tip</p>
            Manual entries take precedence over automated sources (crawls/PDFs). Use them to override AI hallucinations or provide specific company policy updates.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualQA;
