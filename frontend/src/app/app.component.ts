import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private router = inject(Router);

  showPublicLayout = signal(true);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) =>{
      const url = event.urlAfterRedirects || event.url;

      // Si l'URL commence par /club, /coach, /admin ou /client → c'est un dashboard

      const isDashboard = url.startsWith('/club') || url.startsWith('/coach') || url.startsWith('/admin') || url.startsWith('/client');

      this.showPublicLayout.set(!isDashboard);

    })
    
  }


}
