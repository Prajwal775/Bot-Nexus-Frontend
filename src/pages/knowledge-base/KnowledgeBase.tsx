import React, { useEffect, useState } from 'react';
import UploadSource from './components/UploadSource';
import CrawlSource from './components/CrawlSource';
import ManualSource from './components/ManualSource';
import SourceTabs from './components/SourceTabs';
import SourcesTable from './components/SourcesTable';
import KnowledgeFooter from './components/knowledgeFooter';
import { fetchKnowledgeBase, KnowledgeItem } from '@/api/knowledgeBase.api';

const apiSourceTypeMap = {
  documents: 'file',
  manual: 'kb_qa',
  crawler: 'kb_url',
} as const;

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'documents' | 'crawler' | 'manual'
  >('documents');

  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sourceType = apiSourceTypeMap[activeTab];

    setLoading(true);

    fetchKnowledgeBase(sourceType)
      .then((res) => setItems(res.items))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className='flex flex-col'>
      <div className='max-w-6xl mx-auto w-full px-8 py-8'>
        {/* Header */}
        <header className='mb-6 flex flex-wrap justify-between items-start gap-4'>
          <div>
            <h1 className='text-white text-2xl font-black'>Knowledge Base</h1>
            <p className='text-[#ab9db9] text-xs'>
              Train your AI with custom data sources.
            </p>
          </div>
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
          <SourcesTable
            activeTab={activeTab}
            items={items}
            loading={loading}
          />
        </section>

        <KnowledgeFooter />
      </div>
    </div>
  );
};

export default KnowledgeBase;
