/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // TipTap / Rich Editor HTML
  coverImage: string;
  authorId: string;
  author: User; // Populated author details
  category: 'Tech' | 'Life' | 'Travel' | 'Finance' | 'Other';
  tags: string[];
  likes: string[]; // List of user IDs who liked the post
  status: 'draft' | 'published';
  readTime: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User; // Populated author details
  body: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, avatar?: string, bio?: string) => Promise<void>;
  updateProfile: (bio: string, avatar: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UIState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}
