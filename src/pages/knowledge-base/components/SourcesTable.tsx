import { KnowledgeItem } from '@/api/knowledgeBase.api';

interface Props {
  activeTab: 'documents' | 'crawler' | 'manual';
  items: KnowledgeItem[];
  loading: boolean;
}

const tabMap = {
  documents: 'file',
  crawler: 'url',
  manual: 'qa',
};

const SourcesTable: React.FC<Props> = ({ activeTab, items, loading }) => {
  const filtered = items.filter(
    (item) => item.source_type === tabMap[activeTab]
  );

  if (loading) {
    return (
      <div className='bg-card-surface rounded-xl p-6 text-sm text-[#ab9db9]'>
        Loading sources…
      </div>
    );
  }

  return (
    <div className='bg-card-surface rounded-xl border border-border-dark overflow-hidden'>
      <table className='w-full text-left border-collapse'>
        <thead>
          <tr className='border-b border-border-dark bg-background-dark/50'>
            <th className='px-6 py-4 text-[10px] text-[#ab9db9] uppercase'>
              Name / Content
            </th>
            <th className='px-6 py-4 text-[10px] text-[#ab9db9] uppercase'>
              Type
            </th>
            <th className='px-6 py-4 text-[10px] text-[#ab9db9] uppercase'>
              Date Added
            </th>
            <th className='px-6 py-4 text-[10px] text-right text-[#ab9db9] uppercase'>
              Actions
            </th>
          </tr>
        </thead>

        <tbody className='divide-y divide-border-dark'>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} className='px-6 py-6 text-xs text-[#ab9db9]'>
                No sources found for this tab.
              </td>
            </tr>
          )}

          {filtered.map((item) => (
            <tr key={item.id} className='hover:bg-primary/5 transition-colors'>
              <td className='px-6 py-4'>
                {item.source_type === 'file' && (
                  <span className='text-sm font-medium'>
                    {item.original_filename}
                  </span>
                )}

                {item.source_type === 'url' && (
                  // <span className='text-sm text-primary'>
                  <span className='text-sm text-white break-all'>
                    {item.source_url}
                  </span>
                )}

                {item.source_type === 'qa' &&
                  (() => {
                    const [question, answer] =
                      item.text_content?.split('\n').map((t) => t.trim()) || [];

                    return (
                      <div className='flex flex-col gap-1'>
                        {question && (
                          <p className='text-sm font-semibold text-white'>
                            {question.replace('Question:', 'Q:')}
                          </p>
                        )}
                        {answer && (
                          <p className='text-xs text-[#ab9db9] leading-relaxed'>
                            {answer.replace('Answer:', 'A:')}
                          </p>
                        )}
                      </div>
                    );
                  })()}
              </td>

              <td className='px-6 py-4 text-xs text-[#ab9db9]'>
                {item.source_type}
              </td>

              <td className='px-6 py-4 text-xs text-[#ab9db9]'>
                {item.uploaded_at
                  ? new Date(item.uploaded_at).toLocaleDateString()
                  : '—'}
              </td>

              <td className='px-6 py-4 text-right'>
                <button className='p-1.5 hover:bg-red-500/10 rounded-lg text-[#ab9db9] hover:text-red-400'>
                  <span className='material-symbols-outlined text-lg'>
                    delete
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SourcesTable;
