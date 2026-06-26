import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth.service';
import { ClubService } from '../../../../core/services/club.service';
import { CommunityService, CommunityResponse } from '../../../../core/services/community.service';
import { PostService, PostResponse } from '../../../../core/services/post.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  clubId?: number;
  clubName = '';
  isPremium = false;
  
  // Community Details
  community: CommunityResponse | null = null;
  hasCommunity = false;
  communityName = '';
  communityDescription = '';
  
  // Posts Feed
  posts: PostResponse[] = [];
  filteredPosts: PostResponse[] = [];
  searchQuery = '';
  activeFilter: 'all' | 'announcement' | 'client' | 'coach' = 'all';

  // Modals & Action States
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  isPostModalOpen = false;
  isEditMode = false;
  currentPost: Partial<PostResponse> = {};

  isDeleteConfirmOpen = false;
  postToDelete: PostResponse | null = null;

  isSettingsModalOpen = false;
  settingsCommunityName = '';
  settingsCommunityDescription = '';

  constructor(
    private authService: AuthService,
    private clubService: ClubService,
    private communityService: CommunityService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.isLoading = true;
      this.clubService.getClubByUserId(user.id).subscribe({
        next: (club: any) => {
          if (club && club.id) {
            this.clubId = club.id;
            this.clubName = club.clubName;
            this.isPremium = club.subscriptionPlan === 'PREMIUM';
            this.loadCommunity();
          } else {
            this.isLoading = false;
            this.showNotification('Could not resolve club profile.', 'error');
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.showNotification('Failed to fetch club profile details.', 'error');
        }
      });
    }
  }

  loadCommunity() {
    if (!this.clubId) return;
    this.isLoading = true;
    this.communityService.getByClubId(this.clubId).subscribe({
      next: (community: CommunityResponse) => {
        this.community = community;
        this.hasCommunity = true;
        this.communityName = community.name;
        this.communityDescription = community.description;
        this.loadPosts();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.hasCommunity = false;
      }
    });
  }

  initializeCommunity() {
    if (!this.clubId) return;
    if (!this.isPremium) {
      this.showNotification('Premium subscription required to create a community.', 'error');
      return;
    }

    this.isLoading = true;
    const req = {
      name: this.clubName + ' Community',
      description: 'Welcome to the official community of ' + this.clubName + '. Connect and discuss with coaches and members!',
      clubId: this.clubId
    };

    this.communityService.create(req).subscribe({
      next: (community: CommunityResponse) => {
        this.isLoading = false;
        this.community = community;
        this.hasCommunity = true;
        this.communityName = community.name;
        this.communityDescription = community.description;
        this.showNotification('Community feed initialized successfully!', 'success');
        this.loadPosts();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.showNotification('Failed to initialize community: ' + (err.error?.message || err.message), 'error');
      }
    });
  }

  loadPosts() {
    if (!this.community) return;
    this.isLoading = true;
    this.postService.getByCommunityId(this.community.id).subscribe({
      next: (posts: PostResponse[]) => {
        this.posts = posts.sort((a, b) => b.id - a.id);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.showNotification('Failed to load posts feed.', 'error');
      }
    });
  }

  applyFilters() {
    let result = [...this.posts];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.content.toLowerCase().includes(q) || 
        (p.userName && p.userName.toLowerCase().includes(q))
      );
    }

    if (this.activeFilter === 'announcement') {
      result = result.filter(p => p.userRole === 'ROLE_CLUB');
    } else if (this.activeFilter === 'client') {
      result = result.filter(p => p.userRole === 'ROLE_CLIENT');
    } else if (this.activeFilter === 'coach') {
      result = result.filter(p => p.userRole === 'ROLE_COACH');
    }

    this.filteredPosts = result;
  }

  onSearchChange() {
    this.applyFilters();
  }

  setFilter(filter: 'all' | 'announcement' | 'client' | 'coach') {
    this.activeFilter = filter;
    this.applyFilters();
  }

  openPostModal(post?: PostResponse) {
    if (post) {
      this.isEditMode = true;
      this.currentPost = { ...post };
    } else {
      this.isEditMode = false;
      this.currentPost = { content: '', imageUrl: '' };
    }
    this.isPostModalOpen = true;
  }

  closePostModal() {
    this.isPostModalOpen = false;
    this.currentPost = {};
  }

  savePost() {
    if (!this.currentPost.content) {
      this.showNotification('Post content cannot be empty!', 'error');
      return;
    }

    if (!this.community || !this.clubId) return;

    this.isLoading = true;
    const user = this.authService.currentUser();
    const userId = user?.id || 1;

    const req = {
      content: this.currentPost.content,
      imageUrl: this.currentPost.imageUrl || '',
      communityId: this.community.id,
      userId: userId
    };

    if (this.isEditMode && this.currentPost.id) {
      this.postService.update(this.currentPost.id, req).subscribe({
        next: () => {
          this.isLoading = false;
          this.closePostModal();
          this.showNotification('Post updated successfully!', 'success');
          this.loadPosts();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.showNotification('Failed to update post: ' + (err.error?.message || err.message), 'error');
        }
      });
    } else {
      this.postService.create(userId, req).subscribe({
        next: () => {
          this.isLoading = false;
          this.closePostModal();
          this.showNotification('Post published to feed!', 'success');
          this.loadPosts();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.showNotification('Failed to publish post: ' + (err.error?.message || err.message), 'error');
        }
      });
    }
  }

  confirmDeletePost(post: PostResponse) {
    this.postToDelete = post;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirm() {
    this.isDeleteConfirmOpen = false;
    this.postToDelete = null;
  }

  executeDeletePost() {
    if (!this.postToDelete) return;
    this.isLoading = true;
    this.postService.delete(this.postToDelete.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeDeleteConfirm();
        this.showNotification('Post deleted successfully (Moderated).', 'success');
        this.loadPosts();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.closeDeleteConfirm();
        this.showNotification('Failed to delete post: ' + (err.error?.message || err.message), 'error');
      }
    });
  }

  openSettingsModal() {
    if (!this.community) return;
    this.settingsCommunityName = this.communityName;
    this.settingsCommunityDescription = this.communityDescription;
    this.isSettingsModalOpen = true;
  }

  closeSettingsModal() {
    this.isSettingsModalOpen = false;
  }

  saveCommunitySettings() {
    if (!this.community || !this.settingsCommunityName) return;

    this.isLoading = true;
    const req = {
      name: this.settingsCommunityName,
      description: this.settingsCommunityDescription,
      clubId: this.clubId!
    };

    this.communityService.update(this.community.id, req).subscribe({
      next: (updatedCommunity: CommunityResponse) => {
        this.isLoading = false;
        this.community = updatedCommunity;
        this.communityName = updatedCommunity.name;
        this.communityDescription = updatedCommunity.description;
        this.closeSettingsModal();
        this.showNotification('Community settings updated successfully!', 'success');
      },
      error: (err: any) => {
        this.isLoading = false;
        this.showNotification('Failed to update community: ' + (err.error?.message || err.message), 'error');
      }
    });
  }

  showNotification(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => this.successMessage = null, 4000);
    } else {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = null, 5000);
    }
  }

  getRoleBadgeClass(role?: string): string {
    switch(role) {
      case 'ROLE_CLUB':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'ROLE_COACH':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'ROLE_CLIENT':
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  }

  getRoleDisplayName(role?: string): string {
    switch(role) {
      case 'ROLE_CLUB':
        return 'Club Owner';
      case 'ROLE_COACH':
        return 'Coach Trainer';
      case 'ROLE_CLIENT':
      default:
        return 'Client Member';
    }
  }

  getRoleBorderClass(role?: string): string {
    switch(role) {
      case 'ROLE_CLUB':
        return 'border-blue-500 bg-blue-50 text-blue-600';
      case 'ROLE_COACH':
        return 'border-purple-500 bg-purple-50 text-purple-600';
      case 'ROLE_CLIENT':
      default:
        return 'border-emerald-500 bg-emerald-50 text-emerald-600';
    }
  }

  getLikesCount(post: PostResponse): number {
    return post.likesCount || 0;
  }

  getCommentsCount(post: PostResponse): number {
    return post.commentsCount || 0;
  }

  simulatePremium() {
    this.isPremium = true;
    this.hasCommunity = true;
    this.communityName = this.clubName + ' Community (Demo)';
    this.communityDescription = 'Welcome to your premium community space. Connect and discuss with your gym members!';
    this.community = {
      id: 99999,
      name: this.communityName,
      description: this.communityDescription,
      clubId: this.clubId || 1,
      createdAt: new Date().toISOString()
    };
    
    this.posts = [
      {
        id: 1,
        content: 'Just finished a 10km run with Coach Karim! Felt amazing! 🏃‍♂️💪',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        communityId: 99999,
        userId: 101,
        userName: 'Ayman El Ftouh',
        commentsCount: 3,
        likesCount: 12,
        userRole: 'ROLE_CLIENT'
      },
      {
        id: 2,
        content: 'Hi team, reminder that my Advanced CrossFit class starts at 6 PM sharp today. Bring your extra energy! 🏋️‍♂️🔥',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        communityId: 99999,
        userId: 102,
        userName: 'Coach Sarah Miller',
        commentsCount: 5,
        likesCount: 24,
        userRole: 'ROLE_COACH'
      },
      {
        id: 3,
        content: 'Announcement: The club will upgrade the cardio machines this Friday. Access to the cardio room will be restricted between 8 AM - 12 PM. Thanks for your patience! 🛠️',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        communityId: 99999,
        userId: this.authService.currentUser()?.id || 1,
        userName: this.clubName,
        commentsCount: 0,
        likesCount: 8,
        userRole: 'ROLE_CLUB'
      }
    ];
    this.applyFilters();
    this.showNotification('Demo Premium Community simulated successfully!', 'success');
  }
}