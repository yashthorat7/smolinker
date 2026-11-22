import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { login, register, checkEmailExists, updatePassword } from '@/services/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const AuthBox = () => {
  const navigate = useNavigate();
  const { setSession, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mode, setMode] = useState('email');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const exists = await checkEmailExists(email);
      setMode(exists ? 'login' : 'register');
    } catch {
      setError('something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!password) {
      setError('please enter your password');
      return;
    }

    setLoading(true);
    try {
      const u = await login(email, password);
      setSession(u);
      navigate('/');
    } catch (err) {
      setError(err.message || 'invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    if (password.length < 8) {
      setError('password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const u = await register(email, password);
      setSession(u);
      navigate('/');
    } catch (err) {
      setError(err.message || 'registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!newPassword || newPassword.length < 8) {
      setError('new password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(email, newPassword);
      setMessage('password updated. sign in with your new password.');
      setPassword(newPassword);
      setNewPassword('');
      setMode('login');
    } catch (err) {
      setError(err.message || 'failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm text-[14px]">
      {mode === 'email' && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3 animate-fade-in-delayed">
          <div className="flex gap-2 items-center w-full">
            <Input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearMessages(); }}
              placeholder="you@example.com"
              autoFocus
            />
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="h-10 px-4 shrink-0 text-[14px]"
            >
              {loading ? 'checking...' : 'continue'}
            </Button>
          </div>
          {error && <p className="text-red-400 text-[14px] text-center animate-fade-in-delayed">{error}</p>}
        </form>
      )}

      {mode === 'login' && (
        <form onSubmit={handleLogin} className="flex flex-col gap-3 animate-fade-in-delayed">
          <div className="flex gap-2 items-center w-full">
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearMessages(); }}
              placeholder="enter password"
              autoFocus
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-10 px-4 shrink-0 text-[14px]"
            >
              {loading ? 'signing in...' : 'sign in'}
            </Button>
          </div>
          
          {message && <p className="text-emerald-400 text-[14px] text-center animate-fade-in-delayed">{message}</p>}
          {error && <p className="text-red-400 text-[14px] text-center animate-fade-in-delayed">{error}</p>}

          <div className="flex justify-between items-center px-1 text-[14px]">
            <button 
              type="button" 
              onClick={() => { setMode('forgot'); clearMessages(); }}
              className="text-zinc-500 hover:text-orange-400 transition-colors cursor-pointer outline-none"
            >
              forgot password?
            </button>
            <button 
              type="button" 
              onClick={() => { setMode('email'); setPassword(''); clearMessages(); }}
              className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer outline-none"
            >
              different email
            </button>
          </div>
        </form>
      )}

      {mode === 'register' && (
        <form onSubmit={handleRegister} className="flex flex-col gap-3 animate-fade-in-delayed">
          <div className="flex gap-2 items-center w-full">
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearMessages(); }}
              placeholder="password (min 8 chars)"
              autoFocus
            />
            <Button
              type="submit"
              disabled={loading || password.length < 8}
              className="h-10 px-4 shrink-0 text-[14px]"
            >
              {loading ? 'creating...' : 'create'}
            </Button>
          </div>

          {error && <p className="text-red-400 text-[14px] text-center animate-fade-in-delayed">{error}</p>}

          <div className="flex justify-end items-center px-1 text-[14px]">
            <button 
              type="button" 
              onClick={() => { setMode('email'); setPassword(''); clearMessages(); }}
              className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer outline-none"
            >
              different email
            </button>
          </div>
        </form>
      )}

      {mode === 'forgot' && (
        <form onSubmit={handleForgot} className="flex flex-col gap-3 animate-fade-in-delayed">
          <div className="text-center mb-1">
            <p className="text-[14px] text-zinc-400 truncate">reset password for <span className="text-zinc-200">{email}</span></p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); clearMessages(); }}
              placeholder="enter new password"
              autoFocus
            />
            <Button
              type="submit"
              disabled={loading || newPassword.length < 8}
              className="h-10 px-4 shrink-0 text-[14px]"
            >
              {loading ? 'resetting...' : 'reset'}
            </Button>
          </div>

          {error && <p className="text-red-400 text-[14px] text-center animate-fade-in-delayed">{error}</p>}

          <div className="flex justify-end items-center px-1 text-[14px]">
            <button 
              type="button" 
              onClick={() => { setMode('login'); clearMessages(); }}
              className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer outline-none"
            >
              back to sign in
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthBox;
