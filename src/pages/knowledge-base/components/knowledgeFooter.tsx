const KnowledgeFooter = () => {
  return (
    <footer className="mt-8 p-3 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-4">
      <span className="material-symbols-outlined text-primary text-lg">
        info
      </span>
      <div className="flex-1">
        <h4 className="text-[14px] font-bold text-white mb-0.5">
          Knowledge Syncing
        </h4>
        <p className="text-[12px] text-[#ab9db9] leading-relaxed">
          Uploaded files and crawled URLs are automatically vectorized and stored
          in a secure vector database. Manual Q&A entries are indexed instantly.
        </p>
      </div>
    </footer>
  );
};

export default KnowledgeFooter;
