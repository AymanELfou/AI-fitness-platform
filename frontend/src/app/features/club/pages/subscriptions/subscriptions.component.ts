import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Plan {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
}

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  plans: Plan[] = [
    { id: 1, name: 'Basic Silver', price: 29, description: 'Perfect for standard gym access and simple setups.', features: ['Full Gym Floor Access', 'Locker Room & Showers', '1 Fitness Assessment/mo'], isPopular: false },
    { id: 2, name: 'Premium Gold', price: 49, description: 'Accelerate results with customized coach plans.', features: ['All Basic Silver Features', 'Group Fitness Classes Included', '2 Personal Trainer Sessions'], isPopular: true },
    { id: 3, name: 'Elite VIP Diamond', price: 89, description: 'Ultimate premium pass with total wellness coverage.', features: ['Unlimited Access 24/7', 'Private Dedicated Coach', 'Spa & Sauna Access'], isPopular: false }
  ];

  constructor() {}
  ngOnInit(): void {}
}