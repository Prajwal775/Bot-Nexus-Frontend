// import React, { useState } from 'react';
// import api from '@/api/axios';
// import { showGlobalToast } from '@/components/ui/ToastProvider';

// const ManualSource: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [loading, setLoading] = useState(false);

//   const resetForm = () => {
//     setQuestion('');
//     setAnswer('');
//   };

//   const handleSubmit = async () => {
//     if (!question.trim() || !answer.trim()) {
//       showGlobalToast('Both question and answer are required', 'warning');
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post(
//         '/api/v1/knowledge-base/qa',
//         {
//           question,
//           answer,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       showGlobalToast('Manual Q&A added successfully', 'success');
//       resetForm();
//       setOpen(false);
//     } catch (err) {
//       console.error(err);
//       showGlobalToast('Failed to add Q&A entry', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Card */}
//       <div className="bg-card-dark rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-all flex flex-col gap-3">
//         <div className="flex items-center gap-2">
//           <div className="text-primary bg-primary/10 w-8 h-8 flex items-center justify-center rounded-lg">
//             <span className="material-symbols-outlined">quiz</span>
//           </div>
//           <h3 className="text-sm font-bold">Manual Q&A</h3>
//         </div>

//         <button
//           onClick={() => setOpen(true)}
//           className="border border-primary text-primary hover:bg-primary hover:text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
//         >
//           <span className="material-symbols-outlined text-sm">add_circle</span>
//           Create Entry
//         </button>
//       </div>

//       {/* Modal */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//           <div className="bg-card-dark border border-border-dark rounded-xl w-full max-w-lg p-6 shadow-2xl">
//             <h2 className="text-white text-lg font-bold mb-4">
//               Create Manual Q&A
//             </h2>

//             {/* Question */}
//             <div className="mb-4">
//               <label className="text-xs font-bold text-[#ab9db9] mb-1 block">
//                 Question
//               </label>
//               <input
//                 type="text"
//                 value={question}
//                 onChange={(e) => setQuestion(e.target.value)}
//                 placeholder="Enter the question"
//                 className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary"
//               />
//             </div>

//             {/* Answer */}
//             <div className="mb-4">
//               <label className="text-xs font-bold text-[#ab9db9] mb-1 block">
//                 Answer
//               </label>
//               <textarea
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//                 placeholder="Enter the answer"
//                 rows={4}
//                 className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white resize-none focus:ring-2 focus:ring-primary focus:border-primary"
//               />
//             </div>

//             {/* Actions */}
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setOpen(false);
//                 }}
//                 className="px-4 py-2 text-xs font-bold text-[#ab9db9] hover:text-white"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
//               >
//                 {loading ? 'Saving…' : 'Save Entry'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ManualSource;

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
