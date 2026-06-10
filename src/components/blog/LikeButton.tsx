import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { axiosInstance } from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

interface LikeButtonProps {
  postId: string;
  initialLikes: string[];
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [likes, setLikes] = useState<string[]>(initialLikes || []);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = user && likes ? likes.includes(user.id) : false;

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast('Sign in to like this story!', { icon: '✨' });
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await axiosInstance.put(`/api/posts/${postId}/like`);
      const updatedLikes = res.data.post.likes;
      setLikes(updatedLikes);
      
      if (!isLiked) {
        toast.success('Added to your likes', { id: 'like-toast' });
      }
    } catch (e) {
      toast.error('Failed to change like state');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-sans font-medium transition-all duration-200 active:scale-95 ${
        isLiked
          ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/45'
          : 'bg-white text-neutral-500 border-neutral-250 hover:bg-neutral-50 hover:text-neutral-900 dark:bg-neutral-900/60 dark:text-neutral-400 dark:border-neutral-800 dark:hover:bg-neutral-800'
      }`}
    >
      <Heart
        className={`h-4.5 w-4.5 transition-transform duration-200 ${
          isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-neutral-400 dark:text-neutral-500'
        } ${isLiking ? 'animate-ping' : ''}`}
      />
      <span>{likes.length}</span>
    </button>
  );
}
export default LikeButton;
