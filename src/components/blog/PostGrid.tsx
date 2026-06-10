import { Post } from '../../types';
import { PostCard } from './PostCard';
import { BookOpen } from 'lucide-react';

interface PostGridProps {
  posts: Post[];
  emptyMessage?: string;
}

export function PostGrid({ posts, emptyMessage = 'No articles found matching details' }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white/40 dark:bg-neutral-900/10 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-150 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600 mb-4">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="text-serif text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-1">
          Silence is golden
        </h3>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id || post.slug} post={post} />
      ))}
    </div>
  );
}
export default PostGrid;
