import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nutrition',
  imports: [CommonModule],
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.scss'
})
export class NutritionComponent {
  plans = [
    { client: 'Amina Benali', initials: 'AB', color: '#6366f1', calories: 1800, protein: '140g', carbs: '180g', fat: '55g', goal: 'Déficit calorique', status: 'Actif' },
    { client: 'Lucas Martin', initials: 'LM', color: '#10b981', calories: 3200, protein: '220g', carbs: '380g', fat: '80g', goal: 'Surplus calorique', status: 'Actif' },
    { client: 'Sofia Reyes', initials: 'SR', color: '#f59e0b', calories: 2200, protein: '150g', carbs: '280g', fat: '65g', goal: 'Maintenance & Endurance', status: 'Actif' },
    { client: 'Chloé Dupont', initials: 'CD', color: '#8b5cf6', calories: 1950, protein: '120g', carbs: '240g', fat: '60g', goal: 'Bien-être & Santé', status: 'Actif' },
  ];
}
