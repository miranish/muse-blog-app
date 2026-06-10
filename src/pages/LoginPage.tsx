import { LoginForm } from '../components/auth/LoginForm';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 bg-[#FAFAF8] dark:bg-[#0F0F0F] transition-colors duration-300">
      
      {/* Return Home button */}
      <div className="w-full max-w-sm mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1 text-xs font-sans tracking-wide uppercase font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-150 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel and return home
        </button>
      </div>

      {/* Login component card */}
      <LoginForm />
    </div>
  );
}
export default LoginPage;
