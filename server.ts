import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { localDB } from './src/db/localDb';

// Extend Express Request type to include user information
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

const app = express();
const PORT = 3000;

// Setup directories
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Global Secrets (fallbacks provided for immediate workspace developer success)
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'muse_secret_access_token_98246abc';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'muse_secret_refresh_token_24680def';

// Middlewares
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use(cookieParser());

// Serve uploads folder statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: JWT generators
function generateAccessToken(payload: { id: string; username: string; email: string }) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(payload: { id: string }) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

// Authentication Middleware
function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required. No bearer token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { id: string; username: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired access token', code: 'TOKEN_EXPIRED' });
  }
}

// --- 1. AUTHENTICATION ENDPOINTS ---

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password, avatar, bio } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Username, email, and password are required' });
    return;
  }

  // Check unique constraints
  if (localDB.getUserByEmail(email)) {
    res.status(400).json({ message: 'Email is already registered' });
    return;
  }
  if (localDB.getUserByUsername(username)) {
    res.status(400).json({ message: 'Username is already taken' });
    return;
  }

  const user = localDB.createUser(username, email, password, avatar, bio);
  
  // Tokens
  const payload = { id: user.id, username: user.username, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user.id });

  // Set refreshToken in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // For local debug preview
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    user,
    accessToken,
    refreshToken, // Return in body as high-reliability fallback for sandboxed iframe previews
  });
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    res.status(400).json({ message: 'Identifier and password are required' });
    return;
  }

  const user = usernameOrEmail.includes('@')
    ? localDB.getUserByEmail(usernameOrEmail)
    : localDB.getUserByUsername(usernameOrEmail);

  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  // Compare passwords
  const bcrypt = require('bcryptjs');
  const match = bcrypt.compareSync(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  // Clean user object (no passwordHash field returned)
  const cleanUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
  };

  const payload = { id: cleanUser.id, username: cleanUser.username, email: cleanUser.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: cleanUser.id });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: cleanUser,
    accessToken,
    refreshToken,
  });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Refresh
app.post('/api/auth/refresh', (req: Request, res: Response) => {
  // Read from cookie, or from JSON body (fallback for sandbox compatibility)
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    res.status(401).json({ message: 'Refresh token is required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
    const user = localDB.getUserById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const cleanUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
    };

    const payload = { id: cleanUser.id, username: cleanUser.username, email: cleanUser.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ id: cleanUser.id });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: cleanUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// Current active Profile (Me)
app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const user = localDB.getUserById(req.user.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
    },
  });
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const { bio, avatar } = req.body;
  const updatedUser = localDB.updateUserProfile(req.user.id, bio, avatar);

  if (!updatedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({
    user: {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt,
    },
  });
});

// --- 2. POSTS ENDPOINTS ---

// Get paginated and filtered posts
app.get('/api/posts', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const category = (req.query.category as string) || '';
  const tag = (req.query.tag as string) || '';
  const search = (req.query.search as string) || '';
  const sort = (req.query.sort as string) || 'latest';
  const authorFilterId = (req.query.authorId as string) || '';

  let allPosts = localDB.getPosts();

  // 1. Author Filter
  if (authorFilterId) {
    allPosts = allPosts.filter(p => p.authorId === authorFilterId);
  }

  // 2. Published vs Draft state filter: only author sees drafts
  // If request has authorization, check if user matches author
  let reqUserId: string | null = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decodedPayload = jwt.verify(token, JWT_ACCESS_SECRET) as { id: string };
      reqUserId = decodedPayload.id;
    } catch (e) {
      // ignore token verification error, treat as guest
    }
  }

  // Filter posts based on draft status
  allPosts = allPosts.filter(p => {
    if (p.status === 'published') return true;
    // status is draft, only show if the requester is the post creator
    return reqUserId !== null && p.authorId === reqUserId;
  });

  // 3. Category Filter
  if (category && category !== 'All') {
    allPosts = allPosts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // 4. Tag Filter
  if (tag) {
    allPosts = allPosts.filter(p => p.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
  }

  // 5. Search Filter (searches Title, Excerpt, Body)
  if (search) {
    const q = search.toLowerCase();
    allPosts = allPosts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q)
    );
  }

  // 6. Sort
  if (sort === 'oldest') {
    allPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sort === 'likes') {
    allPosts.sort((a, b) => b.likes.length - a.likes.length);
  } else {
    // latest (default)
    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // 7. Paginate
  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedDbPosts = allPosts.slice(offset, offset + limit);

  // Populate authors
  const populatedPosts = paginatedDbPosts.map(p => localDB.getPopulatedPost(p));
  const hasMore = page < totalPages;

  res.json({
    posts: populatedPosts,
    page,
    limit,
    total,
    totalPages,
    hasMore,
  });
});

// Get posts by author
app.get('/api/posts/author/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const posts = localDB.getPosts().filter(p => p.authorId === userId && p.status === 'published');
  const populated = posts.map(p => localDB.getPopulatedPost(p));
  res.json({ posts: populated });
});

// Get single post by slug
app.get('/api/posts/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = localDB.getPostBySlug(slug) || localDB.getPostById(slug);

  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  const populated = localDB.getPopulatedPost(post);
  const comments = localDB.getCommentsForPost(post.id);

  res.json({
    post: populated,
    comments,
  });
});

// Create Post
app.post('/api/posts', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { title, excerpt, body, coverImage, category, tags, status } = req.body;

  if (!title || !body) {
    res.status(400).json({ message: 'Title and body fields are required to draft a post.' });
    return;
  }

  const post = localDB.createPost({
    title,
    excerpt,
    body,
    coverImage,
    authorId: req.user.id,
    category,
    tags,
    status,
  });

  res.status(201).json({ post });
});

// Update Post
app.put('/api/posts/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const updates = req.body;

  const post = localDB.getPostById(id);
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  if (post.authorId !== req.user.id) {
    res.status(403).json({ message: 'You are not authorized to update this article.' });
    return;
  }

  const updated = localDB.updatePost(id, req.user.id, updates);
  res.json({ post: updated });
});

// Delete Post
app.delete('/api/posts/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const post = localDB.getPostById(id);

  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  if (post.authorId !== req.user.id) {
    res.status(403).json({ message: 'You are not authorized to delete this article.' });
    return;
  }

  const success = localDB.deletePost(id, req.user.id);
  res.json({ success, message: 'Post deleted successfully.' });
});

// Toggle Like
app.put('/api/posts/:id/like', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const post = localDB.toggleLikePost(id, req.user.id);

  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  res.json({ post });
});

// --- 3. COMMENTS ENDPOINTS ---

// Get comments for post
app.get('/api/comments/:postId', (req: Request, res: Response) => {
  const { postId } = req.params;
  const comments = localDB.getCommentsForPost(postId);
  res.json({ comments });
});

// Add comment
app.post('/api/comments/:postId', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { postId } = req.params;
  const { body } = req.body;

  if (!body || body.trim().length === 0) {
    res.status(400).json({ message: 'Comment content is required' });
    return;
  }

  const comment = localDB.createComment(postId, req.user.id, body);
  if (!comment) {
    res.status(404).json({ message: 'Comment creation failed. Post or user not found.' });
    return;
  }

  res.status(201).json({ comment });
});

// Delete comment
app.delete('/api/comments/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const success = localDB.deleteComment(id, req.user.id);

  if (!success) {
    res.status(403).json({ message: 'Unauthorized or Comment not found' });
    return;
  }

  res.json({ success, message: 'Comment deleted' });
});

// --- 4. DATA IMAGE UPLOAD ---
// Decodes a base64 files and saves them to local disk /public/uploads
app.post('/api/upload/image', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { image } = req.body;

  if (!image) {
    res.status(400).json({ message: 'Base64 image is required.' });
    return;
  }

  try {
    // Format: 'data:image/jpeg;base64,...'
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ message: 'Invalid base64 image data.' });
      return;
    }

    const type = matches[1]; // e.g. 'image/jpeg' or 'image/png'
    const dataBuffer = Buffer.from(matches[2], 'base64');
    
    // Choose file extension
    let ext = 'jpg';
    if (type.includes('png')) ext = 'png';
    if (type.includes('gif')) ext = 'gif';
    if (type.includes('webp')) ext = 'webp';

    const filename = `image-${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, dataBuffer);

    // Return the relative URL from the server
    res.json({
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('File write error:', error);
    res.status(500).json({ message: 'Error processing your file upload.' });
  }
});


// --- 5. VITE INTEGRATION RUNTIME ---

async function startServer() {
  // Integrate Vite dynamically based on environment mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Mount Vite's middleware
    app.use(vite.middlewares);
  } else {
    // Serve client static production assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Muse Blog platform server operating cleanly on http://localhost:${PORT}`);
  });
}

startServer();
