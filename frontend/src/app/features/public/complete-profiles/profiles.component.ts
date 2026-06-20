import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { CoachProfileComponent } from './coach-profile/coach-profile.component';
import { ClubProfileComponent } from './club-profile/club-profile.component';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    CommonModule, 
    ClientProfileComponent, 
    CoachProfileComponent, 
    ClubProfileComponent
  ],
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  
  activeRole: 'client' | 'coach' | 'club' | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    this.route.queryParamMap.subscribe(params => {
      const role = params.get('role');
      if (role === 'client' || role === 'coach' || role === 'club') {
        this.activeRole = role;
      } else {
        this.activeRole = null; 
      }
    });
  }
}