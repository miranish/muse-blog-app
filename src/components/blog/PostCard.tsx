import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Heart, Clock } from 'lucide-react';

interface PostCardProps {
  key?: any;
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // Format human dates elegantly
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Tech': return 'amber';
      case 'Travel': return 'lavender';
      default: return 'slate';
    }
  };

  return (
    <article className="group h-full flex flex-col bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-neutral-200/60 dark:bg-neutral-900/40 dark:border-neutral-900 dark:hover:border-neutral-800 transition-all duration-300">
      
      {/* Cover Image container */}
      <Link to={`/post/${post.slug || post.id}`} className="relative block aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={post.coverImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.03]"
          loading="lazy"
        />
        {post.status === 'draft' && (
          <span className="absolute top-3 left-3 bg-neutral-900/90 text-amber-300 text-[10px] font-sans tracking-widest uppercase font-bold py-1 px-2.5 rounded-md backdrop-blur-sm shadow border border-amber-400/20">
            Draft
          </span>
        )}
      </Link>

      {/* Content wrapper */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Category & Readtime row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <Badge variant={getCategoryColor(post.category)}>
            {post.category}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 font-sans font-medium">
            <Clock className="h-3 w-3" />
            {post.readTime} min read
          </span>
        </div>

        {/* Title & Excerpt */}
        <div className="flex-1">
          <Link to={`/post/${post.slug || post.id}`} className="block group-hover:text-amber-500 transition-colors">
            <h3 className="font-serif text-xl font-bold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 mb-2 group-hover:text-amber-500 dark:group-hover:text-amber-400">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-sans font-normal line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Tag chips */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[11px] text-neutral-400 dark:text-neutral-500 font-sans">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* User Card Row */}
        <div className="mt-5 pt-4 flex items-center justify-between border-t border-neutral-50 dark:border-neutral-900">
          <Link to={`/author/${post.authorId}`} className="flex items-center gap-2.5 group/author">
            <Avatar src={post.author?.avatar} name={post.author?.username} size="sm" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-700 group-hover/author:text-amber-500 dark:text-neutral-300 dark:group-hover/author:text-amber-400 transition-colors">
                {post.author?.username || 'Writer'}
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </Link>

          {/* Likes read indicator */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
            <Heart className={`h-4.5 w-4.5 ${post.likes.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-neutral-300 dark:text-neutral-600'}`} />
            <span className="font-sans font-medium">{post.likes.length}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
export default PostCard;
