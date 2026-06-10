import { create } from 'zustand';
import { UIState } from '../types';

export const useUIStore = create<UIState>((set) => {
  // Determine starting theme
  let initialTheme: 'light' | 'dark' = 'light';
  try {
    const stored = localStorage.getItem('muse_theme');
    if (stored === 'dark' || stored === 'light') {
      initialTheme = stored;
    } else {
      // Respect default preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      initialTheme = mediaQuery.matches ? 'dark' : 'light';
    }
  } catch (e) {}

  // Apply class on document element immediately
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }

  return {
    theme: initialTheme,
    setTheme: (theme) => {
      try {
        localStorage.setItem('muse_theme', theme);
      } catch (e) {}
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      set({ theme });
    },
    toggleTheme: () => {
      set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        try {
          localStorage.setItem('muse_theme', nextTheme);
        } catch (e) {}
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
        return { theme: nextTheme };
      });
    },
  };
});
