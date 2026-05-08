import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  mobileMenuOpen = false;
  showUpgradeModal = false;

  constructor(private router: Router, private notificationService: NotificationService) {}

  openUpgradeModal() {
    this.showUpgradeModal = true;
  }

  closeUpgradeModal() {
    this.showUpgradeModal = false;
  }

  goToClubs() {
    this.showUpgradeModal = false;
    this.notificationService.showPremiumNotification();
    this.router.navigate(['/clubs']);
  }
}
