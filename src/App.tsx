import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { Layout } from './components/layout/Layout';
import { Toaster } from 'react-hot-toast';

// Import Pages
import { Home } from './pages/Home';
import { PostPage } from './pages/PostPage';
import { CreatePost } from './pages/CreatePost';
import { EditPost } from './pages/EditPost';
import { AuthorPage } from './pages/AuthorPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFound } from './pages/NotFound';

export default function App() {
  const refresh = useAuthStore((state) => state.refresh);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const theme = useUIStore((state) => state.theme);

  // Silent session hydration on launch
  useEffect(() => {
    refresh();
  }, [refresh]);

  if (isInitializing) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors ${
        theme === 'dark' ? 'bg-[#0F0F0F] text-[#F0EDE6]' : 'bg-[#FAFAF8] text-[#111111]'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-400 border-t-transparent" />
          <span className="font-serif text-sm tracking-wider font-semibold animate-pulse">Initializing Muse...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main feeds */}
          <Route path="/" element={<Home />} />
          
          {/* Single article reads */}
          <Route path="/post/:slug" element={<PostPage />} />
          
          {/* Create & edits */}
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          
          {/* Onboarding gateways */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Authors collections */}
          <Route path="/author/:userId" element={<AuthorPage />} />
          
          {/* Empty fallback redirects */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>

      {/* Styled Flash notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'font-sans text-xs tracking-wide border rounded-2xl p-4 bg-white text-neutral-850 border-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800 shadow-xl transition-all',
          duration: 3500,
          style: {
            borderRadius: '16px',
          },
        }}
      />
    </Router>
  );
}
