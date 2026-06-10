import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      toast.error('All fields are required');
      return;
    }

    setIsLoading(true);
    setErrorCode('');
    try {
      await login(usernameOrEmail.trim(), password);
      toast.success('Welcome back to Muse!', { icon: '✨' });
      navigate('/');
    } catch (err: any) {
      setErrorCode(err.message || 'Incorrect credentials');
      toast.error(err.message || 'Failed signing in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white border border-neutral-100 rounded-3xl p-8 shadow-xl dark:bg-neutral-900/40 dark:border-neutral-900/60 transition-colors duration-300">
      
      {/* Brand logo & header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-amber-400 dark:text-neutral-950 mb-3 shadow">
          <span className="font-serif text-xl font-bold">M</span>
        </div>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
          Welcome Back
        </h2>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1 font-sans">
          Sign in to access your editorial feed
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Username/Email */}
        <Input
          id="usernameOrEmail"
          label="Username or Email"
          placeholder="e.g. miranish"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />

        {/* Password */}
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorCode && (
          <p className="text-xs text-rose-500 font-sans text-center">{errorCode}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full font-serif font-bold text-sm"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      {/* Footer redirection link */}
      <div className="mt-6 text-center text-xs font-sans text-neutral-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-amber-500 hover:underline dark:hover:text-amber-400">
          Get Started
        </Link>
      </div>
    </div>
  );
}
export default LoginForm;
