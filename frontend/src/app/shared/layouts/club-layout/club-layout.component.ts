import { Component } from '@angular/core';
import { RouterOutlet,RouterLink,RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-club-layout',
  imports: [CommonModule,NgIf,RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './club-layout.component.html',
  styleUrl: './club-layout.component.scss'
})
export class ClubLayoutComponent {

}
