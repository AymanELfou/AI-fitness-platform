import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientNavbarComponent } from '../../components/client-navbar/client-navbar.component';
import { ClientFooterComponent } from '../../components/client-footer/client-footer.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterOutlet, ClientNavbarComponent, ClientFooterComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent {

}
