import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PostForm } from '../components/blog/PostForm';
import { axiosInstance } from '../api/axiosInstance';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const fetchDraftForEdit = async () => {
      setIsLoading(true);
      setErrorText('');
      try {
        const response = await axiosInstance.get(`/api/posts/${id}`);
        setPost(response.data.post);
      } catch (err: any) {
        console.error(err);
        setErrorText(err.response?.data?.message || 'Article could not be retrieved');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDraftForEdit();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin h-8 w-8 text-amber-400 mb-2" />
        <p className="text-xs text-neutral-400 font-sans">Rehydrating draft records...</p>
      </div>
    );
  }

  // Session guard: Check if authenticated or is author
  const isAuthorized = isAuthenticated && user && post && post.authorId === user.id;

  if (errorText || !post || !isAuthorized) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-sm mx-auto">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4 dark:bg-rose-950/25">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="font-serif text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-1">
          Unauthorized Workspace
        </h2>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-6 leading-relaxed">
          {errorText || "You are not authorized to edit this article. Modification is strictly restricted to the original author."}
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="border-b border-neutral-100 dark:border-neutral-900/50 py-4.5 bg-neutral-50/50 dark:bg-neutral-950 text-center relative pointer-events-none select-none">
        <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-neutral-400">
          Revising Publication Archive
        </span>
      </div>
      <PostForm initialData={post} isEdit={true} />
    </div>
  );
}
export default EditPost;
