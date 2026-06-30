import {
  Component, signal, PLATFORM_ID, Inject, OnInit, inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Comment, Post } from '../../../../core/models/community.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientService } from '../../../../core/services/client.service';
import { CommunityService, CommunityResponse } from '../../../../core/services/community.service';
import { PostService, PostResponse } from '../../../../core/services/post.service';
import { LikeService, LikeResponse } from '../../../../core/services/like.service';
import { CommentService, CommentResponse } from '../../../../core/services/comment.service';

export type FeedFilter = 'All' | 'Clients' | 'Coaches' | 'My Posts';

@Component({
  selector: 'app-client-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class ClientCommunityComponent implements OnInit {

  authService = inject(AuthService);
  clientService = inject(ClientService);
  communityService = inject(CommunityService);
  postService = inject(PostService);
  likeService = inject(LikeService);
  commentService = inject(CommentService);

  /* ── Feed Filter ── */
  activeFilter = signal<FeedFilter>('All');
  filters: FeedFilter[] = ['All', 'Clients', 'Coaches', 'My Posts'];

  /* ── New Post Modal ── */
  showNewPostModal = signal<boolean>(false);
  newPostText = '';
  newPostTags = '';
  newPostImage = '';

  /* ── Current user ── */
  currentUser = {
    id: 0,
    name: 'Athlete',
    initial: 'A',
    color: '#2563EB',
    role: 'client'
  };

  colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#ec4899'];

  community: CommunityResponse | null = null;
  posts: Post[] = [];
  isLoading = false;

  /* ── Sidebar data ── */
  topMembers: any[] = [];

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

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    this.setupCurrentUser();
    this.loadCommunityAndPosts();
  }

  setupCurrentUser() {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.currentUser.id = user.id;
      this.currentUser.name = (user.firstname || '') + ' ' + (user.lastname || '');
      if (!this.currentUser.name.trim()) this.currentUser.name = 'Athlete';
      this.currentUser.initial = this.currentUser.name.charAt(0).toUpperCase();
      this.currentUser.color = this.getColor(user.id);
    }
  }

  loadCommunityAndPosts() {
    const user = this.authService.currentUser();
    if (!user || !user.id) return;

    this.isLoading = true;
    this.clientService.getClientByUserId(user.id).subscribe({
      next: (clientProfile) => {
        if (clientProfile && clientProfile.clubId) {
          this.loadClubClients(clientProfile.clubId);
          this.communityService.getByClubId(clientProfile.clubId).subscribe({
            next: (community) => {
              this.community = community;
              this.loadPosts();
            },
            error: (err) => {
              console.error('Failed to load club community, falling back', err);
              this.fallbackToAnyCommunity();
            }
          });
        } else {
          this.fallbackToAnyCommunity();
        }
      },
      error: (err) => {
        console.error('Failed to load client profile', err);
        this.fallbackToAnyCommunity();
      }
    });
  }

  loadClubClients(clubId: number) {
    this.clientService.getClientsByClubId(clubId).subscribe({
      next: (clients) => {
        this.topMembers = clients.map(c => ({
          name: c.userName || 'Membre',
          initial: (c.userName || 'M').charAt(0).toUpperCase(),
          color: this.getColor(c.userId),
          role: 'client',
          posts: 0,
          likes: 0
        })).slice(0, 5);
      },
      error: (err) => console.error('Failed to load club clients', err)
    });
  }

  fallbackToAnyCommunity() {
    this.communityService.getAll().subscribe({
      next: (communities) => {
        if (communities && communities.length > 0) {
          this.community = communities[0];
          this.loadPosts();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load all communities', err);
        this.isLoading = false;
      }
    });
  }

  loadPosts() {
    if (!this.community) {
      this.isLoading = false;
      return;
    }

    this.postService.getByCommunityId(this.community.id).subscribe({
      next: (dbPosts: PostResponse[]) => {
        const currentUserId = this.currentUser.id;
        const mappedPosts: Post[] = dbPosts.map(p => {
          const postObj: Post = {
            id: p.id,
            authorName: p.userName || 'Utilisateur',
            authorInitial: (p.userName || 'U').charAt(0).toUpperCase(),
            authorColor: this.getColor(p.userId),
            role: p.userRole === 'ROLE_COACH' ? 'coach' : 'client',
            timeAgo: this.formatDate(p.createdAt),
            content: p.content,
            image: p.imageUrl,
            tags: [],
            likes: p.likesCount || 0,
            liked: false,
            comments: [],
            showComments: false,
            newComment: '',
            menuOpen: false,
            userId: p.userId
          };

          /* const hashtags = p.content.match(/#\w+/g);
          if (hashtags) {
            postObj.tags = hashtags.map( => t.substring(1));
          } */

          this.commentService.getCommentsByPostId(p.id).subscribe({
            next: (comments: CommentResponse[]) => {
              postObj.comments = comments.map(c => ({
                id: c.id,
                authorName: c.userName || 'Utilisateur',
                authorInitial: (c.userName || 'U').charAt(0).toUpperCase(),
                authorColor: this.getColor(c.userId),
                role: 'client',
                text: c.content,
                timeAgo: this.formatDate(c.createdAt),
                likes: 0,
                liked: false
              }));
            }
          });

          this.likeService.getLikesByPostId(p.id).subscribe({
            next: (likes: LikeResponse[]) => {
              postObj.liked = likes.some(l => l.userId === currentUserId);
              postObj.likes = likes.length;
            }
          });

          return postObj;
        });

        this.posts = mappedPosts.sort((a, b) => b.id - a.id);
        
        // Derive top members from posts if club fallback didn't find any
        if (this.topMembers.length === 0 && this.posts.length > 0) {
          const membersMap = new Map<string, any>();
          this.posts.forEach(p => {
            if (!membersMap.has(p.authorName)) {
              membersMap.set(p.authorName, {
                name: p.authorName,
                initial: p.authorInitial,
                color: p.authorColor,
                role: p.role,
                posts: 1,
                likes: p.likes
              });
            } else {
              const m = membersMap.get(p.authorName);
              m.posts += 1;
              m.likes += p.likes;
            }
          });
          this.topMembers = Array.from(membersMap.values())
            .sort((a, b) => b.posts - a.posts)
            .slice(0, 5);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load posts', err);
        this.isLoading = false;
      }
    });
  }

  /* ── Computed filtered posts ── */
  get filteredPosts(): Post[] {
    const f = this.activeFilter();
    const currentUserId = this.currentUser.id;
    if (f === 'All') return this.posts;
    if (f === 'Coaches') return this.posts.filter(p => p.role === 'coach');
    if (f === 'Clients') return this.posts.filter(p => p.role === 'client');
    if (f === 'My Posts') return this.posts.filter(p => p.userId === currentUserId);
    return this.posts;
  }

  get totalPosts(): number { return this.posts.length; }
  get coachPosts(): number { return this.posts.filter(p => p.role === 'coach').length; }
  get totalLikes(): number { return this.posts.reduce((s, p) => s + p.likes, 0); }

  /* ── Actions ── */
  setFilter(f: FeedFilter): void { this.activeFilter.set(f); }

  toggleLike(post: Post): void {
    if (!this.currentUser.id) return;
    this.likeService.toggleLike(post.id, this.currentUser.id).subscribe({
      next: () => {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
      },
      error: (err) => console.error('Failed to toggle like', err)
    });
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
    if (!text || !this.currentUser.id) return;

    const request = {
      content: text,
      postId: post.id
    };

    this.commentService.createComment(this.currentUser.id, request).subscribe({
      next: (newComment: CommentResponse) => {
        post.newComment = '';
        post.comments.push({
          id: newComment.id,
          authorName: this.currentUser.name,
          authorInitial: this.currentUser.initial,
          authorColor: this.currentUser.color,
          role: 'client',
          text: newComment.content,
          timeAgo: 'Just now',
          likes: 0,
          liked: false
        });
      },
      error: (err) => console.error('Failed to submit comment', err)
    });
  }

  submitPost(): void {
    const text = this.newPostText.trim();
    if (!text || !this.community || !this.currentUser.id) return;

    let finalContent = text;
    if (this.newPostTags.trim()) {
      const parsedTags = this.newPostTags.split(',').map(t => t.trim()).filter(Boolean);
      if (parsedTags.length > 0) {
        finalContent += '\n\n' + parsedTags.map(t => '#' + t).join(' ');
      }
    }

    const request = {
      content: finalContent,
      imageUrl: this.newPostImage,
      communityId: this.community.id,
      userId: this.currentUser.id
    };

    this.postService.create(this.currentUser.id, request).subscribe({
      next: () => {
        this.newPostText = '';
        this.newPostTags = '';
        this.newPostImage = '';
        this.showNewPostModal.set(false);
        this.loadPosts();
      },
      error: (err) => console.error('Failed to create post', err)
    });
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
    this.postService.delete(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== post.id);
      },
      error: (err) => console.error('Failed to delete post', err)
    });
  }

  sharePost(post: Post): void {
    if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
      navigator.clipboard.writeText(`Check out this post from ${post.authorName} on SmartTrainer!`);
    }
    post.menuOpen = false;
  }

  closeAllMenus(): void { this.posts.forEach(p => p.menuOpen = false); }

  getColor(id?: number): string {
    if (!id) return this.colors[0];
    return this.colors[id % this.colors.length];
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  }

  trackById(_: number, item: { id: number }): number { return item.id; }
}
