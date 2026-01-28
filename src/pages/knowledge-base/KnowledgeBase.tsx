import React, { useState } from 'react';
import UploadSource from './components/UploadSource';
import CrawlSource from './components/CrawlSource';
import ManualSource from './components/ManualSource';
import SourceTabs from './components/SourceTabs';
import SourcesTable from './components/SourcesTable';
import KnowledgeFooter from './components/knowledgeFooter';

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'documents' | 'crawler' | 'manual'
  >('documents');

  return (
    <div className='flex-1 flex flex-col h-full overflow-y-auto'>
      <div className='max-w-6xl mx-auto w-full px-8 py-8'>
        {/* Header */}
        <header className='mb-6 flex flex-wrap justify-between items-start gap-4'>
          <div>
            <h1 className='text-white text-2xl font-black'>Knowledge Base</h1>
            <p className='text-[#ab9db9] text-xs'>
              Train your AI with custom data sources.
            </p>
          </div>
          <button className='flex items-center gap-2 px-3 py-1.5 border border-border-dark rounded-lg text-xs font-medium hover:bg-card-dark'>
            <span className='material-symbols-outlined text-xs'>refresh</span>
            Sync All
          </button>
        </header>

        {/* Quick Actions */}
        <section className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <UploadSource />
          <CrawlSource />
          <ManualSource />
        </section>

        {/* Tabs + Table */}
        <section>
          <SourceTabs activeTab={activeTab} onChange={setActiveTab} />
          <SourcesTable />
        </section>

        <KnowledgeFooter />
      </div>
    </div>
  );
};

export default KnowledgeBase;
