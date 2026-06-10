import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Post, Comment } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Types for local database storage schemas (separate from frontend interfaces because we need password fields)
interface DBUser extends User {
  passwordHash: string;
}

interface DBPost extends Omit<Post, 'author'> {}

interface DatabaseSchema {
  users: DBUser[];
  posts: DBPost[];
  comments: Comment[];
}

const DEFAULT_DATABASE: DatabaseSchema = {
  users: [
    {
      id: 'author-1',
      username: 'miranish',
      email: 'miranish25@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Founder, full-stack developer, and open-source enthusiast. Writing about code, design, and aesthetics.',
      createdAt: new Date('2026-05-01T12:00:00Z').toISOString(),
      passwordHash: bcrypt.hashSync('password123', 10),
    },
    {
      id: 'author-2',
      username: 'elena_travels',
      email: 'elena@travel.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      bio: 'Travel journalist and high-altitude hiker. Exploring silent places and sharing design inspirations from around the globe.',
      createdAt: new Date('2026-05-15T10:00:00Z').toISOString(),
      passwordHash: bcrypt.hashSync('traveling99', 10),
    }
  ],
  posts: [
    {
      id: 'post-1',
      title: 'The Silent Aesthetic of Ghost and Substack',
      slug: 'silent-aesthetic-ghost-substack',
      excerpt: 'How editorial minimalism, spacious canvas design, and focused typography are reshaping the future of publishing.',
      body: `<h2>Typography Over Decoration</h2>
<p>In the digital age, we suffer from cognitive overload. Websites compete for our attention with popups, banners, flashing metrics, and noisy sidebars. High-fidelity publishing platforms like Substack and Ghost succeed by doing the opposite: they remove clutter entirely.</p>

<h3>Designing for the Reader</h3>
<p>When you sit down to read, your screen should disappear. The typography should do the heavy lifting. Pairing an elegant serif display font like <strong>Playfair Display</strong> for titles with a highly legible, clean sans-serif like <strong>Inter</strong> for the main copy creates an elegant rhythm.</p>

<p>Consider the dimensions of your reading pane. A line containing more than 75 characters is fatiguing for the human eye. Restricting the main text layout to a centralized <code>720px</code> container invites focus, encouraging long-form comprehension.</p>

<blockquote>"Simplicity is not the lack of clutter, but the presence of clarity." – Jony Ive</blockquote>

<h3>What We Can Borrow</h3>
<ul>
  <li><strong>Generous Margins:</strong> Give content room to breathe. Margins are not wasted space; they are visual rest periods.</li>
  <li><strong>Typographic Scale:</strong> Drastic differences between header weights and paragraph text define a clean reading hierarchy.</li>
  <li><strong>High Contrast:</strong> Clean off-white canvases paired with charcoal black text decrease visual strain.</li>
</ul>

<p>By treating the reader's focus as sacred, we create experiences that feel less like a screen and more like an immersive printed editorial book.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
      authorId: 'author-1',
      category: 'Tech',
      tags: ['Design', 'Minimalism', 'Typography'],
      likes: ['author-2'],
      status: 'published',
      readTime: 3,
      createdAt: new Date('2026-06-01T09:00:00Z').toISOString(),
      updatedAt: new Date('2026-06-01T09:00:00Z').toISOString(),
    },
    {
      id: 'post-2',
      title: 'A Hiking Journal Through the Swiss Alps',
      slug: 'hiking-journal-swiss-alps',
      excerpt: 'Exploring remote passes and high meadows in the heart of Switzerland. Notes on scenery, gear, and solitude.',
      body: `<h2>Setting Out from Lauterbrunnen</h2>
<p>The mist hung low in the valley as we packed our rucksacks. Guided only by yellow signposts and the faint tolling of distant cowbells, we began our climb towards the high pasture lines.</p>

<h3>Scaling the Sefinenfurgge Pass</h3>
<p>The ascent is steep, a series of rocky switchbacks that test both calves and spirit. But as the clouds break, you are greeted by the magnificent north faces of the Eiger, Mönch, and Jungfrau. In these spaces, screens have no power.</p>

<p>Here are three essential takeaways from our high-altitude week:</p>
<ul>
  <li><strong>Travel Light:</strong> Every ounce on your back becomes a burden. This is as true for code architecture as it is for hiking gear.</li>
  <li><strong>Wake with the Sun:</strong> Mountain weather is unpredictable. Arriving at your lodge before the afternoon thermal storms is rule number one.</li>
  <li><strong>Embrace Silence:</strong> Solitude is a scarce resource. Use it to reflect, write, and simply breathe.</li>
</ul>

<h3>Evening at the Golderli Hut</h3>
<p>Over a warm bowl of rösti, we exchanged journals and stories with hikers from all walks of life. No Wi-Fi, just warm lanterns and the cold shadows of the peaks outside. It reminds me of the beauty of writing: transmitting a moment across time and space.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
      authorId: 'author-2',
      category: 'Travel',
      tags: ['Adventure', 'Nature', 'Switzerland'],
      likes: ['author-1'],
      status: 'published',
      readTime: 4,
      createdAt: new Date('2026-06-05T14:30:00Z').toISOString(),
      updatedAt: new Date('2026-06-05T14:30:00Z').toISOString(),
    },
    {
      id: 'post-3',
      title: 'The Blueprint of a Focused Mind',
      slug: 'blueprint-focused-mind',
      excerpt: 'Practical mental frameworks to conquer notification overload, block out noise, and trigger pristine flows.',
      body: `<h2>The Cost of Inattention</h2>
<p>We live in a high-density sensory environment. Every service on our devices is engineered to hijack our dopamine loop. Each buzz, alert, or pop-up is a minor cognitive context switch. Research shows it takes an average of 23 minutes to return to a task after a single distraction.</p>

<h3>Building a Focused Ritual</h3>
<p>To enter deep work, you need to create a visual and digital physical vacuum. Here is how I structure my mornings:</p>

<ol>
  <li><strong>The Digital Cleanse:</strong> Put your phone in another room. Close all tabs except the direct work editor.</li>
  <li><strong>Time Boxing:</strong> Set a physical timer for 90 minutes. Do not stand up, load your inbox, or look at metrics until the chime.</li>
  <li><strong>Caffeine Timing:</strong> Wait 90 minutes after waking before your first cortisolic lift. This aligns perfectly with natural circadian energy curves.</li>
</ol>

<p>Your mind is a pristine workspace. Keep its walls high, its layout immaculate, and its distractions minimal. Let depth represent your competitive advantage.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=1200',
      authorId: 'author-1',
      category: 'Life',
      tags: ['Focus', 'Productivity', 'Mindset'],
      likes: [],
      status: 'published',
      readTime: 3,
      createdAt: new Date('2026-06-08T08:15:00Z').toISOString(),
      updatedAt: new Date('2026-06-08T08:15:00Z').toISOString(),
    }
  ],
  comments: [
    {
      id: 'comment-1',
      postId: 'post-1',
      authorId: 'author-2',
      author: {
        id: 'author-2',
        username: 'elena_travels',
        email: 'elena@travel.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        bio: 'Travel journalist and high-altitude hiker. Exploring silent places and sharing design inspirations from around the globe.',
        createdAt: new Date('2026-05-15T10:00:00Z').toISOString(),
      },
      body: 'This is spot on. Minimalist designs always evoke a sense of trust and quality. It really lets the written word shine.',
      createdAt: new Date('2026-06-02T11:20:00Z').toISOString(),
    },
    {
      id: 'comment-2',
      postId: 'post-1',
      authorId: 'author-1',
      author: {
        id: 'author-1',
        username: 'miranish',
        email: 'miranish25@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        bio: 'Founder, full-stack developer, and open-source enthusiast. Writing about code, design, and aesthetics.',
        createdAt: new Date('2026-05-01T12:00:00Z').toISOString(),
      },
      body: 'Thank you Elena! Absolutely. Good to have you here reading and commenting.',
      createdAt: new Date('2026-06-02T13:45:00Z').toISOString(),
    }
  ]
};

class LocalDB {
  private data: DatabaseSchema;

  constructor() {
    this.data = DEFAULT_DATABASE;
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
      } catch (e) {
        console.error('Error parsing localDb file, using default structure', e);
        this.save();
      }
    } else {
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving database states to disk', e);
    }
  }

  // --- Users Operations ---
  getUsers(): DBUser[] {
    return this.data.users;
  }

  getUserById(id: string): DBUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): DBUser | undefined {
    const norm = email.toLowerCase().trim();
    return this.data.users.find(u => u.email.toLowerCase().trim() === norm);
  }

  getUserByUsername(username: string): DBUser | undefined {
    const norm = username.toLowerCase().trim();
    return this.data.users.find(u => u.username.toLowerCase().trim() === norm);
  }

  createUser(username: string, email: string, passwordPlain: string, avatar?: string, bio?: string): DBUser {
    const passwordHash = bcrypt.hashSync(passwordPlain, 10);
    const id = 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newUser: DBUser = {
      id,
      username: username.trim(),
      email: email.toLowerCase().trim(),
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      bio: bio || '',
      createdAt: new Date().toISOString(),
      passwordHash,
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUserProfile(userId: string, bio: string, avatar: string): DBUser | undefined {
    const user = this.getUserById(userId);
    if (!user) return undefined;
    user.bio = bio;
    if (avatar) {
      user.avatar = avatar;
    }
    // Update comments by this user too so user details are synced
    this.data.comments.forEach(c => {
      if (c.authorId === userId) {
        c.author.bio = bio;
        if (avatar) {
          c.author.avatar = avatar;
        }
      }
    });
    this.save();
    return user;
  }

  // --- Posts Operations ---
  getPosts(): DBPost[] {
    return this.data.posts;
  }

  getPostById(id: string): DBPost | undefined {
    return this.data.posts.find(p => p.id === id);
  }

  getPostBySlug(slug: string): DBPost | undefined {
    return this.data.posts.find(p => p.slug === slug);
  }

  getPopulatedPost(post: DBPost): Post {
    const author = this.getUserById(post.authorId);
    const cleanAuthor: User = author
      ? {
          id: author.id,
          username: author.username,
          email: author.email,
          avatar: author.avatar,
          bio: author.bio,
          createdAt: author.createdAt,
        }
      : {
          id: post.authorId,
          username: 'Unknown Author',
          email: '',
          avatar: '',
          bio: '',
          createdAt: '',
        };

    return {
      ...post,
      author: cleanAuthor,
    };
  }

  createPost(postData: {
    title: string;
    excerpt?: string;
    body: string;
    coverImage?: string;
    authorId: string;
    category?: 'Tech' | 'Life' | 'Travel' | 'Finance' | 'Other';
    tags?: string[];
    status?: 'draft' | 'published';
  }): Post {
    const { title, excerpt, body, coverImage, authorId, category, tags, status } = postData;
    const cleanTitle = title.trim();
    const slug = cleanTitle.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();
    
    const wordCount = body.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const id = 'post-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newPost: DBPost = {
      id,
      title: cleanTitle,
      slug,
      excerpt: excerpt || cleanTitle.substring(0, 150) + '...',
      body,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      authorId,
      category: category || 'Other',
      tags: tags || [],
      likes: [],
      status: status || 'published',
      readTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.posts.push(newPost);
    this.save();
    return this.getPopulatedPost(newPost);
  }

  updatePost(
    postId: string,
    authorId: string,
    updates: {
      title?: string;
      excerpt?: string;
      body?: string;
      coverImage?: string;
      category?: 'Tech' | 'Life' | 'Travel' | 'Finance' | 'Other';
      tags?: string[];
      status?: 'draft' | 'published';
    }
  ): Post | undefined {
    const post = this.getPostById(postId);
    if (!post || post.authorId !== authorId) return undefined;

    if (updates.title !== undefined) {
      post.title = updates.title.trim();
    }
    if (updates.excerpt !== undefined) {
      post.excerpt = updates.excerpt;
    }
    if (updates.body !== undefined) {
      post.body = updates.body;
      const wordCount = updates.body.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
      post.readTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    if (updates.coverImage !== undefined) {
      post.coverImage = updates.coverImage;
    }
    if (updates.category !== undefined) {
      post.category = updates.category;
    }
    if (updates.tags !== undefined) {
      post.tags = updates.tags;
    }
    if (updates.status !== undefined) {
      post.status = updates.status;
    }
    post.updatedAt = new Date().toISOString();

    this.save();
    return this.getPopulatedPost(post);
  }

  deletePost(postId: string, authorId: string): boolean {
    const lengthBefore = this.data.posts.length;
    this.data.posts = this.data.posts.filter(p => !(p.id === postId && p.authorId === authorId));
    
    if (this.data.posts.length < lengthBefore) {
      // Also delete comment connections to this deleted post
      this.data.comments = this.data.comments.filter(c => c.postId !== postId);
      this.save();
      return true;
    }
    return false;
  }

  toggleLikePost(postId: string, userId: string): Post | undefined {
    const post = this.getPostById(postId);
    if (!post) return undefined;

    const idx = post.likes.indexOf(userId);
    if (idx === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(idx, 1);
    }

    this.save();
    return this.getPopulatedPost(post);
  }

  // --- Comments Operations ---
  getCommentsForPost(postId: string): Comment[] {
    return this.data.comments.filter(c => c.postId === postId);
  }

  getCommentById(commentId: string): Comment | undefined {
    return this.data.comments.find(c => c.id === commentId);
  }

  createComment(postId: string, authorId: string, body: string): Comment | undefined {
    const post = this.getPostById(postId);
    if (!post) return undefined;

    const author = this.getUserById(authorId);
    if (!author) return undefined;

    const id = 'comment-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newComment: Comment = {
      id,
      postId,
      authorId,
      author: {
        id: author.id,
        username: author.username,
        email: author.email,
        avatar: author.avatar,
        bio: author.bio,
        createdAt: author.createdAt,
      },
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    this.data.comments.push(newComment);
    this.save();
    return newComment;
  }

  deleteComment(commentId: string, authorId: string): boolean {
    const lengthBefore = this.data.comments.length;
    this.data.comments = this.data.comments.filter(c => !(c.id === commentId && c.authorId === authorId));
    if (this.data.comments.length < lengthBefore) {
      this.save();
      return true;
    }
    return false;
  }
}

export const localDB = new LocalDB();
