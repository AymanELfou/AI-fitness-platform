export interface Comment {
  id: number;
  authorName: string;
  authorInitial: string;
  authorColor: string;
  role: 'client' | 'coach';
  text: string;
  timeAgo: string;
  likes: number;
  liked: boolean;
}

export interface Post {
  id: number;
  authorName: string;
  authorInitial: string;
  authorColor: string;
  authorAvatar?: string;
  role: 'client' | 'coach' | string;
  timeAgo: string;
  content: string;
  image?: string;
  tags: string[];
  likes: number;
  liked: boolean;
  comments: Comment[];
  showComments: boolean;
  newComment: string;
  menuOpen: boolean;
  userId: number;
}
