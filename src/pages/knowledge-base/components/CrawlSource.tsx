import React, { useState } from 'react';
import api from '@/api/axios';
import { showGlobalToast } from '@/components/ui/ToastProvider';

const CrawlSource: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCrawl = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      showGlobalToast('Please enter a valid URL', 'warning');
      return;
    }
    try {
      setLoading(true);

      await api.post('/api/v1/knowledge-base/url', {
        url: trimmedUrl,
      });

      showGlobalToast('Website crawl started successfully', 'success');
      setUrl(''); // optional: clear input after success
    } catch (err) {
      console.error(err);
      showGlobalToast('Failed to crawl website', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card-dark rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-all flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="text-primary bg-primary/10 w-8 h-8 flex items-center justify-center rounded-lg">
          <span className="material-symbols-outlined">language</span>
        </div>
        <h3 className="text-sm font-bold">Crawl Website</h3>
      </div>

      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className="flex-1 bg-background-dark border-border-dark rounded-lg text-xs px-3 py-2 text-white placeholder:text-[#ab9db9] disabled:opacity-50"
          placeholder="https://example.com"
          type="url"
        />
        <button
          onClick={handleCrawl}
          disabled={loading}
          className="bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Crawling…' : 'Crawl'}
        </button>
      </div>
    </div>
  );
};

export default CrawlSource;
