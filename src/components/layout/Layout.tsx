import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111] dark:bg-[#0F0F0F] dark:text-[#F0EDE6] transition-colors duration-300">
      
      {/* Sticky Blurred Page Header */}
      <Navbar />

      {/* Primary Container Column */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
export default Layout;
