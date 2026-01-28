import React, { useRef, useState } from 'react';
import api from '@/api/axios';
import { showGlobalToast } from '@/components/ui/ToastProvider';

const UploadSource: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', selectedFile);

      await api.post('/api/v1/upload/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showGlobalToast('File uploaded successfully', 'success');
      clearFile();
      setOpen(false);
    } catch (err) {
      console.error(err);
      showGlobalToast('File upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Upload Card */}
      <div
        onClick={() => setOpen(true)}
        className='bg-card-dark rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-all flex flex-col gap-3 cursor-pointer'
      >
        <div className='flex items-center gap-2'>
          <div className='text-primary bg-primary/10 w-8 h-8 flex items-center justify-center rounded-lg'>
            <span className='material-symbols-outlined'>upload_file</span>
          </div>
          <h3 className='text-sm font-bold'>Upload File</h3>
        </div>

        <div className='border border-dashed border-border-dark rounded-lg p-3 flex items-center justify-center hover:bg-primary/5 gap-2 group'>
          <span className='material-symbols-outlined text-[#ab9db9] group-hover:text-primary'>
            add_circle
          </span>
          <span className='text-xs text-[#ab9db9]'>
            Click to upload PDF, DOCX, TXT…
          </span>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <div className='bg-card-dark border border-border-dark rounded-xl w-full max-w-md p-6 shadow-2xl'>
            <h2 className='text-white text-lg font-bold mb-4'>
              Upload Knowledge File
            </h2>

            {/* File picker */}
            {!selectedFile && (
              <>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.pdf,.txt,.doc,.docx'
                  onChange={handleFileChange}
                  className='block w-full text-sm text-[#ab9db9]
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0
                             file:text-sm file:font-semibold
                             file:bg-primary file:text-white
                             hover:file:bg-primary/90'
                />
                <p className='mt-2 text-[11px] text-[#ab9db9]'>
                  Supported formats: PDF, DOC, DOCX, TXT
                </p>
              </>
            )}

            {/* Selected file preview */}
            {selectedFile && (
              <div className='flex items-center justify-between bg-background-dark border border-border-dark rounded-lg px-4 py-3 mt-2'>
                <div className='flex items-center gap-2 min-w-0'>
                  <span className='material-symbols-outlined text-primary'>
                    description
                  </span>
                  <span className='text-sm text-white truncate'>
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  onClick={clearFile}
                  className='material-symbols-outlined text-[#ab9db9] hover:text-red-400 transition-colors'
                  aria-label='Remove file'
                >
                  close
                </button>
              </div>
            )}

            {/* Actions */}
            <div className='flex justify-end gap-3 mt-6'>
              <button
                onClick={() => {
                  clearFile();
                  setOpen(false);
                }}
                className='px-4 py-2 text-xs font-bold text-[#ab9db9] hover:text-white'
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className='px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50'
              >
                {loading ? 'Uploading…' : 'Upload File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadSource;
