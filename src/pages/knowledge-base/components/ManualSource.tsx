import { useNavigate } from 'react-router-dom';

const ManualSource = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-card-dark rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-all flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="text-primary bg-primary/10 w-8 h-8 flex items-center justify-center rounded-lg">
          <span className="material-symbols-outlined">quiz</span>
        </div>
        <h3 className="text-sm font-bold">Manual Q&A</h3>
      </div>

      <button
        onClick={() => navigate('/knowledge-base/manual')}
        className="border border-primary text-primary hover:bg-primary hover:text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">add_circle</span>
        Create Entry
      </button>
    </div>
  );
};

export default ManualSource;
