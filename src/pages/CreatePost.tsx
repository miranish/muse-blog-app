import { useAuthStore } from '../store/authStore';
import { PostForm } from '../components/blog/PostForm';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { ShieldAlert, BookOpen, PenSquare } from 'lucide-react';

export function CreatePost() {
  const { isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-6 dark:bg-neutral-900/60 dark:text-neutral-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-neutral-950 dark:text-neutral-50 mb-2">
          Registration Required
        </h2>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8 max-w-sm leading-relaxed">
          You must be an authorized member of Muse to compose articles and post to our open-source catalog.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="primary" size="md">
              Sign In
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="md">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="border-b border-neutral-100 dark:border-neutral-900/50 py-4.5 bg-neutral-50/50 dark:bg-neutral-950 text-center relative pointer-events-none select-none">
        <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-neutral-400">
          Studio Draft Mode
        </span>
      </div>
      <PostForm />
    </div>
  );
}
export default CreatePost;
