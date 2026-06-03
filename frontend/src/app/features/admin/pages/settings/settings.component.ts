import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class AdminSettingsComponent {
  activeTab = 'general';
  tabs = [
    { id:'general',   label:'General',       icon:'⚙️' },
    { id:'security',  label:'Security',      icon:'🔒' },
    { id:'plans',     label:'Plans & Pricing',icon:'💳' },
    { id:'email',     label:'Email & Notifs', icon:'📧' },
  ];

  /* General */
  platformName = 'SmartTrainer';
  tagline = 'Your AI-Powered Fitness Platform';
  supportEmail = 'support@smarttrainer.com';
  maintenanceMode = false;
  allowRegistrations = true;

  /* Security */
  requireEmailVerif = true;
  twoFactorForAdmin = true;
  sessionTimeout = 60;
  maxLoginAttempts = 5;

  /* Plans */
  plans = [
    { name:'Basic',      price:9,   features:['5 Clients','Basic Analytics','Email Support'],                    color:'#475569' },
    { name:'Pro',        price:49,  features:['50 Clients','Advanced Analytics','Priority Support','AI Tools'],   color:'#2563EB' },
    { name:'Enterprise', price:299, features:['Unlimited','Full Analytics','Dedicated Manager','White Label'],    color:'#7C3AED' },
  ];

  /* Email */
  emailProvider = 'SendGrid';
  welcomeEmail = true;
  progressEmail = true;
  paymentEmail = true;
  weeklyDigest = false;

  saved = false;

  save(): void {
    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }
}
