import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Sun, Moon, PenSquare, LogOut, User, LogIn, Sparkles, Compass } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md dark:border-neutral-900 dark:bg-neutral-950/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white dark:bg-amber-400 dark:text-neutral-950 transition-transform group-hover:scale-105">
            <span className="font-serif text-lg font-bold">M</span>
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-neutral-900 group-hover:opacity-85 dark:text-neutral-50">
            Muse
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Explore Button */}
          <Link to="/" className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors" title="Explore Articles">
            <Compass className="h-5 w-5" />
          </Link>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated && user ? (
            <>
              {/* Compose New Post button */}
              <Link to="/create" className="hidden sm:inline-flex">
                <Button size="sm" variant="primary" className="flex items-center gap-1.5 font-sans">
                  <PenSquare className="h-4 w-4" />
                  Write
                </Button>
              </Link>
              
              {/* Mobile compose pen icon */}
              <Link to="/create" className="sm:hidden p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                <PenSquare className="h-5 w-5" />
              </Link>

              {/* Profile options Dropdown / button links */}
              <Link to={`/author/${user.id}`} title="My Profile" className="flex items-center gap-2 pl-1 select-none">
                <Avatar src={user.avatar} name={user.username} size="sm" className="ring-2 ring-neutral-100 hover:ring-amber-300 dark:ring-neutral-800 dark:hover:ring-amber-400" />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400 transition-colors"
                title="Log out session"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="primary" size="sm" className="font-sans">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export default Navbar;
