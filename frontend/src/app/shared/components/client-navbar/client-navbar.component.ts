import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './client-navbar.component.html',
  styleUrl: './client-navbar.component.scss'
})
export class ClientNavbarComponent {

  mobileMenuOpen = false;
  profileDropdownOpen = false;
  notifCount = 3;

  navLinks = [
    { label: 'Dashboard', path: '/client/dashboard' },
    { label: 'Programs',  path: '/client/programs'  },
    { label: 'Progress',  path: '/client/progress'  },
    { label: 'Workouts',  path: '/client/workouts'  },
    { label: 'Community', path: '/client/community' },
    { label: 'Chat',      path: '/client/chat'      },
  ];

  constructor(public authService: AuthService) {}

  toggleProfile() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  logout() {
    this.authService.logout();
  }

  /** Close dropdown when user clicks outside */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#profile-menu-wrapper')) {
      this.profileDropdownOpen = false;
    }
  }
}
