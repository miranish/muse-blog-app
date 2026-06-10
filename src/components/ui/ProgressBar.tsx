import { useEffect, useState } from 'react';

export function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      if (documentHeight - windowHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-100 dark:bg-neutral-900/60 z-50">
      <div
        className="h-full bg-amber-400 transition-all duration-75 origin-left"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
export default ProgressBar;
