import {
  Component, signal, computed, PLATFORM_ID, Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Comment, Post } from '../../../../core/models/community.model';

export type FeedFilter = 'All' | 'Clients' | 'Coaches' | 'My Posts';

@Component({
  selector: 'app-client-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class ClientCommunityComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /* ── Feed Filter ── */
  activeFilter = signal<FeedFilter>('All');
  filters: FeedFilter[] = ['All', 'Clients', 'Coaches', 'My Posts'];

  /* ── New Post Modal ── */
  showNewPostModal = signal<boolean>(false);
  newPostText = '';
  newPostTags = '';
  newPostImage = '';

  /* ── Current user ── */
  /* ── Posts ── */
  posts: Post[] = [
    {
      id: 1,
      authorName: 'Sarah Jenkins',
      authorInitial: 'S',
      authorColor: '#7C3AED',
      role: 'client',
      timeAgo: '2 hours ago',
      content: 'Just crushed the new HIIT sequence in the Advanced Program! 💥 The data tracking was completely spot on. Heart rate stayed in the optimal zone for 85% of the session. Who else is hitting their targets this week?',
      image: 'images/community/post_kettlebell.png',
      tags: [],
      likes: 248,
      liked: false,
      comments: [
        { id: 1, authorName: 'Marcus Chen', authorInitial: 'M', authorColor: '#2563EB', role: 'coach', text: 'Amazing work Sarah! Your consistency is paying off 🔥', timeAgo: '1h', likes: 12, liked: false },
        { id: 2, authorName: 'Lena Torres', authorInitial: 'L', authorColor: '#059669', role: 'client', text: 'Goals!! I need to get to this level 💪', timeAgo: '45m', likes: 5, liked: false }
      ],
      showComments: false,
      newComment: '',
      menuOpen: false
    },
    {
      id: 2,
      authorName: 'Coach Marcus Chen',
      authorInitial: 'M',
      authorColor: '#2563EB',
      role: 'coach',
      timeAgo: '5 hours ago',
      content: 'Reminder: Rest days are just as important as training days. Your central nervous system needs recovery to maintain high output. Trust the clinical data and take it easy today if your metrics show high strain.',
      tags: ['Recovery', 'Data Driven'],
      likes: 856,
      liked: true,
      comments: [
        { id: 3, authorName: 'Alex Johnson', authorInitial: 'A', authorColor: '#2563EB', role: 'client', text: 'This is exactly what I needed to hear. Taking my rest day seriously today 🙏', timeAgo: '4h', likes: 8, liked: false }
      ],
      showComments: false,
      newComment: '',
      menuOpen: false
    },
    {
      id: 3,
      authorName: 'Jordan Kim',
      authorInitial: 'J',
      authorColor: '#DC2626',
      role: 'client',
      timeAgo: '8 hours ago',
      content: 'NEW PR ALERT! 🏆 Finally hit 315 lbs on deadlift — a goal I\'ve been chasing for 6 months! The programming in this platform is next level. Shoutout to Coach Marcus for the technique adjustments last session!',
      image: 'images/community/post_deadlift.png',
      tags: ['PR', 'Deadlift', 'Milestone'],
      likes: 412,
      liked: false,
      comments: [
        { id: 4, authorName: 'Coach Marcus Chen', authorInitial: 'M', authorColor: '#2563EB', role: 'coach', text: 'LETS GOOO Jordan!! This is what we\'ve been building toward. 315 is just the beginning 🎯', timeAgo: '7h', likes: 32, liked: false },
        { id: 5, authorName: 'Sarah Jenkins', authorInitial: 'S', authorColor: '#7C3AED', role: 'client', text: 'Insane progress!! You\'re an inspiration 🙌', timeAgo: '6h', likes: 14, liked: false }
      ],
      showComments: false,
      newComment: '',
      menuOpen: false
    },
    {
      id: 4,
      authorName: 'Coach Elena Vasquez',
      authorInitial: 'E',
      authorColor: '#059669',
      role: 'coach',
      timeAgo: '1 day ago',
      content: '📊 Weekly Nutrition Tip: Don\'t underestimate the power of meal prep. Clients who prep their meals on Sunday see 40% better macro adherence throughout the week. Here\'s my Sunday prep spread — 5 days of fuel, locked in!',
      image: 'images/community/post_meal.png',
      tags: ['Nutrition', 'Meal Prep', 'Coach Tip'],
      likes: 1024,
      liked: false,
      comments: [
        { id: 6, authorName: 'Lena Torres', authorInitial: 'L', authorColor: '#059669', role: 'client', text: 'This is so motivating! Starting my meal prep journey this weekend 🥗', timeAgo: '20h', likes: 6, liked: false },
        { id: 7, authorName: 'Jordan Kim', authorInitial: 'J', authorColor: '#DC2626', role: 'client', text: 'What containers are those? They look amazing!', timeAgo: '18h', likes: 3, liked: false }
      ],
      showComments: false,
      newComment: '',
      menuOpen: false
    },
    
  ];

  /* ── Computed filtered posts ── */
  get filteredPosts(): Post[] {
    const f = this.activeFilter();
    if (f === 'All') return this.posts;
    if (f === 'Coaches') return this.posts.filter(p => p.role === 'coach');
    if (f === 'Clients') return this.posts.filter(p => p.role === 'client');
    if (f === 'My Posts') return this.posts.filter(p => p.authorName === this.currentUser.name);
    return this.posts;
  }

  get totalPosts(): number { return this.posts.length; }
  get coachPosts(): number { return this.posts.filter(p => p.role === 'coach').length; }
  get totalLikes(): number { return this.posts.reduce((s, p) => s + p.likes, 0); }

  /* ── Sidebar data ── */
  topMembers = [
    { name: 'Coach Marcus Chen', initial: 'M', color: '#2563EB', role: 'coach', posts: 12, likes: 856 },
    { name: 'Sarah Jenkins',     initial: 'S', color: '#7C3AED', role: 'client', posts: 8,  likes: 248 },
    { name: 'Jordan Kim',        initial: 'J', color: '#DC2626', role: 'client', posts: 6,  likes: 412 },
    { name: 'Coach Elena V.',    initial: 'E', color: '#059669', role: 'coach', posts: 9,  likes: 1024 },
    { name: 'Alex Johnson',      initial: 'A', color: '#2563EB', role: 'client', posts: 3,  likes: 89 },
  ];

  trendingTags = [
    { tag: 'PR',         count: 34, size: '0.95rem' },
    { tag: 'Hypertrophy',count: 28, size: '0.875rem' },
    { tag: 'Recovery',   count: 22, size: '0.875rem' },
    { tag: 'Nutrition',  count: 19, size: '0.8125rem' },
    { tag: 'Deadlift',   count: 17, size: '0.8125rem' },
    { tag: 'MealPrep',   count: 15, size: '0.8125rem' },
    { tag: 'Bench',      count: 12, size: '0.75rem' },
    { tag: 'CoachTip',   count: 10, size: '0.75rem' },
  ];

  /* ── Actions ── */
  setFilter(f: FeedFilter): void { this.activeFilter.set(f); }

  toggleLike(post: Post): void {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  toggleCommentLike(c: Comment): void {
    c.liked = !c.liked;
    c.likes += c.liked ? 1 : -1;
  }

  toggleComments(post: Post): void {
    post.showComments = !post.showComments;
  }

  submitComment(post: Post): void {
    const text = post.newComment.trim();
    if (!text) return;
    post.comments.unshift({
      id: Date.now(),
      authorName: this.currentUser.name,
      authorInitial: this.currentUser.initial,
      authorColor: this.currentUser.color,
      role: this.currentUser.role,
      text,
      timeAgo: 'Just now',
      likes: 0,
      liked: false
    });
    post.newComment = '';
  }

  submitPost(): void {
    const text = this.newPostText.trim();
    if (!text) return;
    const tags = this.newPostTags.split(',').map(t => t.trim()).filter(Boolean);
    const parsedTags = this.newPostTags.split(',').map(t => t.trim()).filter(Boolean);
    
    const newPost: Post = {
      id: Date.now(),
      authorName: this.currentUser.name,
      authorInitial: this.currentUser.initial,
      authorColor: this.currentUser.color,
      role: 'client',
      timeAgo: 'À l\'instant',
      content: this.newPostText,
      image: this.newPostImage || undefined,
      tags: parsedTags,
      likes: 0,
      liked: false,
      comments: [],
      showComments: false,
      newComment: '',
      menuOpen: false,
      userId: this.currentUser.id
    };

    this.posts.unshift(newPost);
    this.closeModal();
  }

  closeModal(): void {
    this.showNewPostModal.set(false);
    this.newPostText = '';
    this.newPostTags = '';
    this.newPostImage = '';
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPostImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.newPostImage = '';
  }

  toggleMenu(post: Post): void {
    this.posts.forEach(p => { if (p.id !== post.id) p.menuOpen = false; });
    post.menuOpen = !post.menuOpen;
  }

  deletePost(post: Post): void {
    this.posts = this.posts.filter(p => p.id !== post.id);
  }

  sharePost(post: Post): void {
    if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
      navigator.clipboard.writeText(`Check out this post from ${post.authorName} on SmartTrainer!`);
    }
    post.menuOpen = false;
  }

  closeAllMenus(): void { this.posts.forEach(p => p.menuOpen = false); }

  trackById(_: number, item: { id: number }): number { return item.id; }
}
