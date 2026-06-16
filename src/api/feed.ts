import { apiRequest } from './client';

export type FeedTab = 'for_you' | 'following' | 'communities' | 'events';

export interface PostAuthor {
  name: string;
  photoUrl: string | null;
  username: string;
  role: string;
}

export interface Post {
  id: string;
  content: string;
  type: 'TEXT' | 'PHOTO' | 'ACHIEVEMENT' | 'EVENT' | 'POLL';
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  liked: boolean;
  author: PostAuthor;
}

export interface HomeStats {
  profileViews: number;
  connections: number;
  opportunities: number;
  posts: number;
}

export interface PostComment {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; photoUrl: string | null; username: string };
}

export function getFeed(tab: FeedTab = 'for_you'): Promise<Post[]> {
  return apiRequest<Post[]>(`/feed?tab=${tab}`, { auth: true });
}

export function createPost(content: string, type?: Post['type']): Promise<Post> {
  return apiRequest<Post>('/posts', {
    method: 'POST',
    auth: true,
    body: { content, type },
  });
}

export function toggleLike(postId: string): Promise<{ liked: boolean; likeCount: number }> {
  return apiRequest<{ liked: boolean; likeCount: number }>(`/posts/${postId}/like`, {
    method: 'POST',
    auth: true,
  });
}

export function getHomeStats(): Promise<HomeStats> {
  return apiRequest<HomeStats>('/home/stats', { auth: true });
}

export function getComments(postId: string): Promise<PostComment[]> {
  return apiRequest<PostComment[]>(`/posts/${postId}/comments`, { auth: true });
}

export function addComment(postId: string, content: string): Promise<PostComment> {
  return apiRequest<PostComment>(`/posts/${postId}/comments`, {
    method: 'POST',
    auth: true,
    body: { content },
  });
}
