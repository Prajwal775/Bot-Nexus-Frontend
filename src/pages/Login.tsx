import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { showGlobalToast } from '@/components/ui/ToastProvider';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      showGlobalToast('Please enter email and password', 'warning');
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      showGlobalToast('Logged in successfully', 'success');
      navigate('/dashboard');
    } catch (err) {
      // interceptor will handle detailed errors
      showGlobalToast('Login failed. Please check your credentials.', 'error');
      console.error('Login error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col bg-background-dark relative overflow-hidden'>
      <header className='w-full flex justify-center py-10 z-10'>
        <div className='flex items-center gap-3 text-primary'>
          <div className='size-8'>
            <svg
              fill='none'
              viewBox='0 0 48 48'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z'
                fill='currentColor'
              ></path>
            </svg>
          </div>
          <h2 className='text-white text-2xl font-bold leading-tight tracking-tight'>
            BotNexus
          </h2>
        </div>
      </header>

      <main className='flex-1 flex items-center justify-center px-6 pb-20 z-10'>
        <div className='w-full max-w-[440px]'>
          <div className='bg-card-dark border border-border-dark rounded-xl shadow-2xl p-8 flex flex-col'>
            <div className='mb-8'>
              <h1 className='text-white text-3xl font-bold tracking-tight text-center'>
                Admin Login
              </h1>
              <p className='text-[#ab9db9] text-sm text-center mt-2'>
                Enter your credentials to access the chatbot dashboard
              </p>
            </div>
            <form
              className='space-y-5'
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className='flex flex-col gap-2'>
                <label className='text-white text-sm font-medium'>
                  Email Address
                </label>
                <input
                  className='w-full rounded-lg text-white border border-border-dark bg-[#211c27] focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 placeholder-[#ab9db9] text-base'
                  placeholder='admin@botnexus.io'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                  <label className='text-white text-sm font-medium'>
                    Password
                  </label>
                  <a
                    className='text-primary text-xs font-semibold hover:underline'
                    href='#'
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className='relative flex items-center'>
                  <input
                    className='w-full rounded-lg text-white border border-border-dark bg-[#211c27] focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 pr-12 placeholder-[#ab9db9] text-base'
                    placeholder='••••••••'
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className='absolute right-3 text-[#ab9db9] hover:text-primary transition-colors'
                    type='button'
                    onClick={() => setShowPwd((s) => !s)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    <span
                      className='material-symbols-outlined'
                      style={{ fontSize: '20px' }}
                    >
                      {showPwd ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                className='w-full h-12 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2'
                type='submit'
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                <span
                  className='material-symbols-outlined'
                  style={{ fontSize: '18px' }}
                >
                  login
                </span>
              </button>
            </form>
            <div className='mt-8 pt-6 border-t border-border-dark flex flex-col items-center gap-4'>
              <p className='text-[#ab9db9] text-xm'>
                Don't have an account?
                <button
                  type='button'
                  onClick={() => navigate('/signup')}
                  className='text-primary font-semibold hover:underline ml-1'
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
          <div className='mt-8 text-center flex flex-col items-center gap-6'>
            <div className='flex items-center gap-4 text-gray-600'>
              <span
                className='material-symbols-outlined'
                style={{ fontSize: '16px' }}
              >
                verified_user
              </span>
              <span className='text-xs uppercase tracking-widest font-medium'>
                Secure AI-Powered Platform
              </span>
            </div>
            <div className='flex gap-2'>
              <div className='size-2 rounded-full bg-primary'></div>
              <div className='size-2 rounded-full bg-gray-700'></div>
              <div className='size-2 rounded-full bg-gray-700'></div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Background */}
      <div className='fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none opacity-40'>
        <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]'></div>
        <div className='absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]'></div>
      </div>
    </div>
  );
};

export default Login;
