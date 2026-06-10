import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Post, Comment } from '../types';
import { axiosInstance } from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CommentSection } from '../components/blog/CommentSection';
import { LikeButton } from '../components/blog/LikeButton';
import { 
  ArrowLeft, Edit3, Trash2, Calendar, Clock, Heart, MessageSquare, 
  ChevronRight, Bookmark, ShieldAlert, Sparkles 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function PostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      setErrorText('');
      try {
        const response = await axiosInstance.get(`/api/posts/${slug}`);
        const rawPost = response.data?.post;
        const fetchedPost = rawPost ? {
          ...rawPost,
          likes: rawPost.likes || [],
          tags: rawPost.tags || [],
        } : null;
        const fetchedComments = response.data?.comments || [];
        setPost(fetchedPost);
        setComments(fetchedComments);
      } catch (err: any) {
        console.error('Failed to get post detail:', err);
        setErrorText(err.response?.data?.message || 'Article not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
    // Scroll window back to top when viewing new items
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const handleDeletePost = async () => {
    if (!post) return;
    const confirmDelete = window.confirm('Are you absolutely sure you want to delete this publication? This action is irreversible.');
    
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/api/posts/${post.id}`);
        toast.success('Article deleted successfully.');
        navigate('/');
      } catch (err) {
        toast.error('Could not complete deletion. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-400 border-t-transparent" />
        <p className="mt-4 text-xs font-sans tracking-wide text-neutral-400 uppercase font-semibold">Consulting ink records...</p>
      </div>
    );
  }

  if (errorText || !post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4 dark:bg-rose-950/20">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Record Not Found
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          {errorText || 'The article slug requested does not exist in our system.'}
        </p>
        <Link to="/">
          <Button variant="outline" size="sm">
            Return to Explorations
          </Button>
        </Link>
      </div>
    );
  }

  const isAuthor = user && post.authorId === user.id;

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Real-time Scrolling Bar reader indicator */}
      <ProgressBar />

      <article className="mx-auto w-full max-w-[720px] px-4 py-8 sm:px-6 md:py-14 flex-1">
        
        {/* Navigation Row */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-sans tracking-wide uppercase font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Explorations
          </button>

          {/* Administrative actions row */}
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link to={`/edit/${post.id}`}>
                <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </Link>
              <Button size="sm" variant="danger" onClick={handleDeletePost} className="flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Categories labels & details */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="amber" className="font-sans font-bold">
            {post.category}
          </Badge>
          <span className="text-xs text-neutral-400 font-sans tracking-wider font-semibold">&bull;</span>
          <span className="text-xs text-neutral-400 font-sans tracking-wide font-medium flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime} min read
          </span>
        </div>

        {/* Article Title display */}
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-neutral-950 dark:text-white mb-6">
          {post.title}
        </h1>

        {/* Excerpt spotlight divider */}
        <p className="font-sans text-md sm:text-lg leading-relaxed text-neutral-500 dark:text-neutral-400 mb-8 border-l-2 border-neutral-200 dark:border-neutral-800 pl-4 italic">
          {post.excerpt}
        </p>

        {/* Author Bio Row Card */}
        <div className="flex items-center justify-between gap-4 py-5 border-y border-neutral-100 dark:border-neutral-900 mb-8 select-none">
          <div className="flex items-center gap-3">
            <Link to={`/author/${post.authorId}`}>
              <Avatar src={post.author?.avatar} name={post.author?.username} size="md" className="ring-2 ring-neutral-50 dark:ring-neutral-900" />
            </Link>
            <div className="flex flex-col">
              <Link to={`/author/${post.authorId}`} className="text-sm font-bold text-neutral-900 hover:text-amber-500 dark:text-neutral-100 dark:hover:text-amber-400 transition-colors">
                {post.author?.username}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-sans mt-0.5">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.status === 'draft' && (
              <Badge variant="slate">DRAFT STATE</Badge>
            )}
          </div>
        </div>

        {/* Full-bleed cover container */}
        {post.coverImage && (
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] mb-10 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow border border-neutral-50 dark:border-neutral-900">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Rich body rendered with typography-first CSS guidelines */}
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
          {/* Main rendered text body */}
          <div
            className="font-sans leading-relaxed text-neutral-800 dark:text-neutral-200 text-base sm:text-lg space-y-6 break-words"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>

        {/* Tags Chips rail */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10 pt-4 border-t border-neutral-50 dark:border-neutral-900">
            {post.tags.map((tag, idx) => (
              <Badge key={idx} variant="slate" className="font-sans font-medium text-[11px] py-1 px-3">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Social interactions (Liking and Sharing) */}
        <div className="flex items-center justify-between gap-4 py-6 border-y border-neutral-100 dark:border-neutral-900 mb-8 select-none">
          <div className="flex items-center gap-3">
            <LikeButton postId={post.id} initialLikes={post.likes} />
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Article link copied to clipboard!');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 text-sm font-sans font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-200 transition-all"
            >
              Share link
            </button>
          </div>

          <span className="text-xs text-neutral-400 font-sans font-medium">
            Published originally as {post.category} collection
          </span>
        </div>

        {/* Dynamic comment interactions */}
        <CommentSection postId={post.id} initialComments={comments} />

      </article>
    </div>
  );
}
export default PostPage;
