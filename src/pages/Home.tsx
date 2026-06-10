import React, { useEffect, useState } from 'react';
import { Post } from '../types';
import { axiosInstance } from '../api/axiosInstance';
import { PostGrid } from '../components/blog/PostGrid';
import { SkeletonGrid } from '../components/ui/SkeletonCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Compass, SlidersHorizontal, Sparkles, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search parameters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  // Categories list
  const categoryOptions = ['All', 'Tech', 'Life', 'Travel', 'Finance', 'Other'];

  // Debounce search input logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on query modifications
    }, 450);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch articles on search/filter state updates
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: '6',
          category: category === 'All' ? '' : category,
          search: debouncedSearch,
          sort: sort,
        });

        // Add headers for draft permission validations
        const res = await axiosInstance.get(`/api/posts?${queryParams.toString()}`);
        const fetchedPosts = res.data?.posts || [];
        const isMore = res.data?.hasMore || false;
        const total = res.data?.total || 0;
        const totalP = res.data?.totalPages || 1;
        
        if (page === 1) {
          setPosts(fetchedPosts);
        } else {
          setPosts((prev) => [...prev, ...fetchedPosts]);
        }
        setHasMore(isMore);
        setTotalPages(totalP);
        setTotalPostsCount(total);
      } catch (err) {
        console.error('Failed to retrieve blog articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [debouncedSearch, category, sort, page]);

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-12 flex-1">
      
      {/* Editorial Hero Spotlight */}
      <section className="text-center py-10 md:py-16 max-w-2xl mx-auto space-y-4">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-800/10">
          <Sparkles className="h-3 w-3" />
          The Creative Column
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
          Where thoughts find their <span className="underline decoration-amber-400 decoration-wavy underline-offset-4">pristine form</span>.
        </h1>
        
        <p className="font-sans text-sm sm:text-md leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
          Deep, long-form journals exploring typography, development, scenery, and mental structures. Created for reader calm.
        </p>

      </section>

      {/* Discovery Toolrail (Search + Filters + Category Tabs) */}
      <section className="space-y-6 mb-10 border-b border-neutral-100 dark:border-neutral-900 pb-6">
        
        {/* Category strips & Sorter selection Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Scrollable category strip */}
          <div className="flex gap-2 items-center overflow-x-auto pb-2 md:pb-0 scrollbar-none select-none">
            {categoryOptions.map((cat) => (
              <Badge
                key={cat}
                variant={category === cat ? 'amber' : 'slate'}
                interactive
                onClick={() => handleCategorySelect(cat)}
                className="px-4 py-1.5 text-xs font-bold"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Sorter selector box */}
          <div className="flex items-center gap-3">
            
            {/* Search Input field wrapper */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search articles & logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white text-neutral-900 border border-neutral-200 rounded-full font-sans text-xs tracking-wide transition-all outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-200/40 dark:bg-neutral-900/60 dark:border-neutral-800 dark:text-neutral-200 dark:focus:border-amber-400/80"
              />
            </div>

            {/* Selector drop down wrapper */}
            <div className="relative inline-flex items-center">
              <SlidersHorizontal className="absolute left-3 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
              <select
                value={sort}
                onChange={handleSortSelect}
                className="pl-8.5 pr-8 py-2 bg-white text-neutral-700 border border-neutral-250 rounded-full font-sans text-xs tracking-wide appearance-none cursor-pointer outline-none focus:border-amber-400 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300"
              >
                <option value="latest">Latest Posts</option>
                <option value="oldest">Oldest Posts</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

      </section>

      {/* Primary Blog Cards Grid container */}
      <section className="space-y-10 min-h-[300px]">
        {isLoading && page === 1 ? (
          <SkeletonGrid count={3} />
        ) : (
          <PostGrid 
            posts={posts} 
            emptyMessage={
              debouncedSearch 
                ? `No articles match "${debouncedSearch}". Try customizing your keywords.` 
                : "No publication logs reside under this category pane."
            } 
          />
        )}

        {/* Load More pagination button */}
        {hasMore && !isLoading && (
          <div className="flex justify-center pt-6">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="px-8 font-sans font-semibold tracking-wide"
            >
              Load More
            </Button>
          </div>
        )}

        {/* Incremental loading spinner indicating load-more events */}
        {isLoading && page > 1 && (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-400 border-t-transparent" />
          </div>
        )}
      </section>

    </div>
  );
}
export default Home;
