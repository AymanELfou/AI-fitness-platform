import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './client-footer.component.html',
  styleUrl: './client-footer.component.scss'
})
export class ClientFooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks = [
    { label: 'Dashboard',   path: '/client/dashboard' },
    { label: 'My Programs', path: '/client/programs'  },
    { label: 'Progress',    path: '/client/progress'  },
    { label: 'Workouts',    path: '/client/workouts'  },
  ];

  supportLinks = [
    { label: 'Help Center',     path: '/help'              },
    { label: 'Community Forum', path: '/client/community'  },
    { label: 'Contact Coach',   path: '/client/chat'       },
    { label: 'Privacy Policy',  path: '/privacy'           },
  ];
}
