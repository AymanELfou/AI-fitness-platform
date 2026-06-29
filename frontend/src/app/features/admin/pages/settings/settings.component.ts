import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { SystemConfigService } from '../../../../core/services/system-config.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class AdminSettingsComponent {
  /* Personal Info */
  firstname = '';
  lastname = '';
  email = '';

  /* General */
  platformName = 'SmartTrainer';
  tagline = 'Your AI-Powered Fitness Platform';
  supportEmail = 'support@smarttrainer.com';
  maintenanceMode = false;

  saved = false;

  constructor(
    private userService: UserService,
    private configService: SystemConfigService
  ) {}

  ngOnInit() {
    this.userService.getMe().subscribe(user => {
      this.firstname = user.firstname;
      this.lastname = user.lastname;
      this.email = user.email;
    });

    this.configService.loadConfig().subscribe(config => {
      this.maintenanceMode = config.maintenanceMode;
    });
  }

  save(): void {
    this.userService.updateMe({
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email
    }).subscribe();

    this.configService.updateMaintenanceMode(this.maintenanceMode).subscribe();

    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }
}
