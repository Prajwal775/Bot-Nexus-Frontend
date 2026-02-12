import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showGlobalToast } from '@/components/ui/ToastProvider';
import { signupApi } from '@/api/auth.api';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showGlobalToast('Please fill all fields', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showGlobalToast('Passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);

      await signupApi(name, email, password);

      showGlobalToast('Account created successfully. Please login.', 'success');
      navigate('/login', { replace: true });
    } catch (err: any) {
      console.error('Signup error', err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Signup failed. Please try again.';

      showGlobalToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col bg-background-dark relative overflow-hidden'>
      {/* Header */}
      <header className='w-full flex justify-center py-10 z-10'>
        <div className='flex items-center gap-3 text-primary'>
          <div className='size-8'>
            <svg fill='none' viewBox='0 0 48 48'>
              <path
                d='M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z'
                fill='currentColor'
              />
            </svg>
          </div>
          <h2 className='text-white text-2xl font-bold tracking-tight'>
            IDLAH
          </h2>
        </div>
      </header>

      {/* Card */}
      <main className='flex-1 flex items-center justify-center px-6 pb-20 z-10'>
        <div className='w-full max-w-[440px]'>
          <div className='bg-card-dark border border-border-dark rounded-xl shadow-2xl p-8 flex flex-col'>
            <div className='mb-8 text-center'>
              <h1 className='text-white text-3xl font-bold tracking-tight'>
                Create Account
              </h1>
              <p className='text-[#ab9db9] text-sm mt-2'>
                Start managing your AI knowledge base
              </p>
            </div>

            <form
              className='space-y-5'
              onSubmit={(e) => {
                e.preventDefault();
                handleSignup();
              }}
            >
              {/* Full Name */}
              <div className='flex flex-col gap-2'>
                <label className='text-white text-sm font-medium'>
                  Full Name
                </label>
                <input
                  className='h-12 px-4 rounded-lg bg-[#211c27] border border-border-dark text-white'
                  placeholder='Sam'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className='flex flex-col gap-2'>
                <label className='text-white text-sm font-medium'>
                  Email Address
                </label>
                <input
                  className='h-12 px-4 rounded-lg bg-[#211c27] border border-border-dark text-white'
                  placeholder='Sam@gmail.com'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className='flex flex-col gap-2'>
                <label className='text-white text-sm font-medium'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    className='h-12 w-full px-4 pr-12 rounded-lg bg-[#211c27] border border-border-dark text-white'
                    type={showPwd ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPwd(!showPwd)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-[#ab9db9]'
                  >
                    <span className='material-symbols-outlined'>
                      {showPwd ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className='flex flex-col gap-2'>
                <label className='text-white text-sm font-medium'>
                  Confirm Password
                </label>
                <input
                  className='h-12 px-4 rounded-lg bg-[#211c27] border border-border-dark text-white'
                  type='password'
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={loading}
                className='w-full h-12 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
              >
                {loading ? 'Creating account…' : 'Create Account'}
                <span className='material-symbols-outlined'>person_add</span>
              </button>
            </form>

            {/* Footer */}
            <div className='mt-8 pt-6 border-t border-border-dark text-center'>
              <p className='text-[#ab9db9] text-xs'>
                Already have an account?
                <button
                  onClick={() => navigate('/login')}
                  className='text-primary font-semibold hover:underline ml-1'
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Background blur */}
      <div className='fixed inset-0 -z-10 opacity-40'>
        <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]' />
        <div className='absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]' />
      </div>
    </div>
  );
};

export default Signup;
