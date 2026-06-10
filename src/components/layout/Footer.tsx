import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-100 bg-neutral-50 dark:border-neutral-900 dark:bg-neutral-950/40 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Brand block */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950">
              <span className="font-serif text-sm font-semibold">M</span>
            </div>
            <span className="font-serif text-base font-semibold tracking-tight text-neutral-800 dark:text-neutral-300">
              Muse
            </span>
          </div>

          {/* Navigational elements */}
          <div className="flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400 font-sans tracking-wide">
            <Link to="/" className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors">Explore</Link>
            <a href="https://github.com/miranish/Blog-App" target="_blank" rel="noreferrer" className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors">Original Repo</a>
          </div>

          {/* Credits notice */}
          <p className="text-[11px] text-neutral-400 dark:text-neutral-600 font-sans tracking-wide sm:text-right">
            &copy; {currentYear} Muse Publishing. Elegant editorial for the modern web.
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
