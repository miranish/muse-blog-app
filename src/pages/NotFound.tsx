import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Compass, FileQuestion } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      
      {/* 404 Illustration placeholder */}
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400 dark:bg-neutral-900/60 dark:text-neutral-600 mb-6 shadow-sm border border-neutral-150 dark:border-neutral-850">
        <FileQuestion className="h-8 w-8" />
      </div>

      {/* Hero text */}
      <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight mb-3">
        Page Left blank
      </h1>

      <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-8 leading-relaxed mx-auto">
        The article slot, author profile, or workspace URL you requested is vacant or has been deleted from our database index.
      </p>

      {/* Recover back Home */}
      <Link to="/">
        <Button variant="primary" size="md" className="flex items-center gap-2">
          <Compass className="h-4 w-4" />
          Navigate to Explorations
        </Button>
      </Link>
    </div>
  );
}
export default NotFound;
