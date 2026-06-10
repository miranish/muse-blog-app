import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { toast } from 'react-hot-toast';
import { Sparkles, Camera } from 'lucide-react';

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState('');

  const handleSuggestAvatar = () => {
    // Generate an randomized beautiful placeholder avatar
    const randomID = Math.floor(Math.random() * 70);
    const mockAvatar = `https://i.pravatar.cc/150?img=${randomID}`;
    setAvatar(mockAvatar);
    toast.success('Generated a placeholder avatar!', { icon: '🎨' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) {
      toast.error('Required fields: Username, Email, and Password');
      return;
    }

    if (username.trim().includes(' ')) {
      toast.error('Username cannot contain spaces.');
      return;
    }

    setIsLoading(true);
    setErrorCode('');
    try {
      await register(username.trim(), email.trim(), password, avatar, bio.trim());
      toast.success('Account created! Welcome to Muse.', { icon: '🌸' });
      navigate('/');
    } catch (err: any) {
      setErrorCode(err.message || 'Onboarding error');
      toast.error(err.message || 'Onboarding failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white border border-neutral-100 rounded-3xl p-8 shadow-xl dark:bg-neutral-900/40 dark:border-neutral-900/60 transition-colors duration-300">
      
      {/* Brand logo & header */}
      <div className="text-center mb-6">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-amber-400 dark:text-neutral-950 mb-3 shadow">
          <span className="font-serif text-xl font-bold">M</span>
        </div>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
          Create Account
        </h2>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1 font-sans">
          Join a minimal community for written expression
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Username */}
        <Input
          id="username"
          label="Username"
          placeholder="e.g. writer_soul"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Email */}
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        {/* Avatar trigger helper */}
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 dark:text-neutral-400">
            Avatar picture
          </label>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 overflow-hidden shadow-inner shrink-0 border border-neutral-100 dark:border-neutral-700">
              {avatar ? <img src={avatar} className="h-full w-full object-cover" /> : <Camera className="h-4 w-4" />}
            </div>
            <input
              type="text"
              placeholder="Paste absolute photo URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="px-3.5 py-1.5 flex-1 text-xs border border-neutral-200 rounded-xl dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 dark:text-neutral-200 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleSuggestAvatar}
              className="p-2 text-xs border rounded-xl bg-orange-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 hover:opacity-80 transition-colors"
              title="Suggest instant placeholder"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Short bio */}
        <Textarea
          id="bio"
          label="Biographical Note (max 200 letters)"
          placeholder="Describe your writing focus..."
          value={bio}
          onChange={(e) => setBio(e.target.value.substring(0, 200))}
          rows={2}
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
          Sign Up
        </Button>
      </form>

      {/* Redirections */}
      <div className="mt-6 text-center text-xs font-sans text-neutral-400">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-amber-500 hover:underline dark:hover:text-amber-400">
          Sign In
        </Link>
      </div>
    </div>
  );
}
export default RegisterForm;
