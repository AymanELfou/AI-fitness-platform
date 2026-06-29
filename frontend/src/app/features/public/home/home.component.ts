import { Component } from '@angular/core';
import { ChatbotComponent } from '../../../shared/components/chatbot/chatbot.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemConfigService } from '../../../core/services/system-config.service';

@Component({
  selector: 'app-home',
  imports: [ChatbotComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  maintenanceMode = false;

  constructor(private configService: SystemConfigService) {}

  ngOnInit(): void {
    this.configService.loadConfig().subscribe(config => {
      this.maintenanceMode = config.maintenanceMode;
    });
  }
}
