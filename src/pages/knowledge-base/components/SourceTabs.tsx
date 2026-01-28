interface Props {
  activeTab: 'documents' | 'crawler' | 'manual';
  onChange: (tab: any) => void;
}

const tabs = [
  { id: 'documents', label: 'Documents' },
  { id: 'crawler', label: 'URL Crawler' },
  { id: 'manual', label: 'Manual Q&A' },
];

const SourceTabs = ({ activeTab, onChange }: Props) => {
  return (
    <div className="flex items-center justify-between border-b border-border-dark mb-6">
      <div className="flex gap-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-3 text-sm font-semibold relative ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-[#ab9db9] hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SourceTabs;
