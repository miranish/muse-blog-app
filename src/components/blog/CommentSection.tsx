import React, { useState } from 'react';
import { Comment, User } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { useAuthStore } from '../../store/authStore';
import { axiosInstance } from '../../api/axiosInstance';
import { Trash, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(`/api/comments/${postId}`, {
        body: commentText.trim(),
      });
      const { comment } = response.data;
      setComments((prev) => [comment, ...prev]);
      setCommentText('');
      toast.success('Comment published!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const backup = [...comments];
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    
    try {
      await axiosInstance.delete(`/api/comments/${commentId}`);
      toast.success('Comment removed');
    } catch (err: any) {
      setComments(backup);
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900">
      
      {/* Title Count */}
      <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-amber-400" />
        Discussion ({comments.length})
      </h3>

      {/* Writing Box block */}
      {isAuthenticated && user ? (
        <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
          <Avatar src={user.avatar} name={user.username} size="sm" className="mt-1" />
          <div className="flex-1">
            <Textarea
              id="comment-text"
              placeholder="Join the discussion... Share your editorial thoughts."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              required
            />
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                disabled={!commentText.trim()}
              >
                Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-150 text-center dark:bg-neutral-900/20 dark:border-neutral-900 mb-8 p-6">
          <p className="text-sm text-neutral-500 mb-3">You must be logged in to participate in the comments section.</p>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Sign In to Muse
            </Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-neutral-400 dark:text-neutral-500 italic text-center py-6">
            Such empty... Be the first to start the conversation!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group/comment border-b border-neutral-50/50 dark:border-neutral-900/50 pb-5">
              <Link to={`/author/${comment.authorId}`}>
                <Avatar src={comment.author?.avatar} name={comment.author?.username} size="sm" />
              </Link>
              
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <Link to={`/author/${comment.authorId}`} className="text-xs font-bold text-neutral-700 hover:text-amber-500 dark:text-neutral-200 dark:hover:text-amber-400">
                      {comment.author?.username}
                    </Link>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  {user && comment.authorId === user.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-450 opacity-0 group-hover/comment:opacity-100 focus:opacity-100 transition-opacity"
                      title="Delete Comment"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 font-sans break-words whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
export default CommentSection;
