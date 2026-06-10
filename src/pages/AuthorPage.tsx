import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, User } from '../types';
import { axiosInstance } from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { PostGrid } from '../components/blog/PostGrid';
import { SkeletonGrid } from '../components/ui/SkeletonCard';
import { Badge } from '../components/ui/Badge';
import { Edit3, User as UserIcon, Calendar, BookOpen, AlertCircle, Save, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function AuthorPage() {
  const { userId } = useParams();
  const { user: currentUser, updateProfile, isAuthenticated } = useAuthStore();

  const [author, setAuthor] = useState<User | null>(null);
  const [authorPosts, setAuthorPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = currentUser && userId === currentUser.id;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchAuthorInfoAndPosts = async () => {
      setIsLoading(true);
      try {
        // Fetch posts by query author filter (which returns both drafts/published if authorized)
        const postRes = await axiosInstance.get(`/api/posts?authorId=${userId}`);
        const fetchedPosts = postRes.data.posts;
        setAuthorPosts(fetchedPosts);

        // Fetch user info from the first matching post, or directly check if currentUser matches
        if (isOwner && currentUser) {
          setAuthor(currentUser);
          setEditedBio(currentUser.bio || '');
          setEditedAvatar(currentUser.avatar || '');
        } else if (fetchedPosts.length > 0) {
          setAuthor(fetchedPosts[0].author);
        } else {
          // Fall back query for user profile
          const userRes = await axiosInstance.get('/api/posts'); // Let's check from all posts
          const postsList = userRes.data.posts as Post[];
          const found = postsList.find(p => p.authorId === userId)?.author;
          
          if (found) {
            setAuthor(found);
          } else {
            // Safe fallback user layout
            setAuthor({
              id: userId || 'unknown',
              username: 'Staff Writer',
              email: 'writer@muse.com',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
              bio: 'Editorial writer and developer. Curating aesthetics and thoughts for the modern long-form web.',
              createdAt: new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.error('Failed to query author profiles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorInfoAndPosts();
  }, [userId, currentUser, isOwner]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    setIsSaving(true);
    try {
      await updateProfile(editedBio.trim(), editedAvatar.trim());
      setIsEditingProfile(false);
      
      // Update local visible author states
      if (author) {
        setAuthor({
          ...author,
          bio: editedBio.trim(),
          avatar: editedAvatar.trim(),
        });
      }
      toast.success('Member profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update member profile parameters');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !author) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 flex-1">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-400 border-t-transparent mx-auto mb-4" />
        <p className="text-center text-xs text-neutral-400 font-sans">Scanning author records...</p>
      </div>
    );
  }

  const publishedCount = authorPosts.filter((p) => p.status === 'published').length;
  const draftCount = authorPosts.filter((p) => p.status === 'draft').length;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 md:py-12 flex-1 space-y-10">
      
      {/* 1. Author profile hero container */}
      <section className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 dark:bg-neutral-900/40 dark:border-neutral-900/80 transition-colors">
        
        {isEditingProfile ? (
          /* Profile customization workspace Form container */
          <form onSubmit={handleProfileSave} className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2">Edit Member Details</h3>
            
            <Input
              id="editedAvatar"
              label="Avatar photo URL"
              value={editedAvatar}
              onChange={(e) => setEditedAvatar(e.target.value)}
              placeholder="Paste absolute photo URL"
            />
            
            <Textarea
              id="editedBio"
              label="Member Biography (max 200 letters)"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value.substring(0, 200))}
              placeholder="e.g. Designer, writer, coffee enthusiast."
              rows={3}
            />

            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSaving}
              >
                Save Details
              </Button>
            </div>
          </form>
        ) : (
          /* Author profile presentation block */
          <div className="flex flex-col sm:flex-row items-start gap-6">
            
            {/* Avatar display column */}
            <Avatar src={author?.avatar} name={author?.username} size="xl" className="shadow border-2 border-white dark:border-neutral-900 shrink-0" />
            
            {/* Bio info column */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
                  {author?.username}
                </h2>
                {isOwner && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="p-1 px-3 text-[10px] font-sans tracking-wide uppercase font-bold border border-neutral-200 rounded-full text-neutral-500 hover:text-amber-500 hover:border-amber-400 dark:border-neutral-800 dark:text-neutral-400 transition-colors"
                  >
                    Edit Bio
                  </button>
                )}
              </div>

              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-sans max-w-xl">
                {author?.bio || 'This member keeps their profile silent... Contributor for Muse Publishing.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-sans pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {author?.createdAt ? formatDate(author.createdAt) : 'June 2026'}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {publishedCount} published articles
                </span>
                {isOwner && draftCount > 0 && (
                  <span className="flex items-center gap-1 text-neutral-450">
                    <AlertCircle className="h-4 w-4" />
                    {draftCount} revisions in drafting
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

      </section>

      {/* 2. Author written articles timeline */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-900 pb-3">
          <h3 className="font-serif text-lg font-bold text-neutral-800 dark:text-neutral-200">
            {isOwner ? 'Your Publication Logs' : `Articles by ${author?.username}`}
          </h3>
        </div>

        {isLoading ? (
          <SkeletonGrid count={2} />
        ) : (
          <PostGrid 
            posts={authorPosts} 
            emptyMessage={
              isOwner 
                ? "You haven't published any articles yet! Click Compose to get started." 
                : "This author hasn't shared any logs in the open-source catalog."
            } 
          />
        )}
      </section>

    </div>
  );
}
export default AuthorPage;
