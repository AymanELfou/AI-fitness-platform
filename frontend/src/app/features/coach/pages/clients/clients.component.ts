import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Client {
  id: number; name: string; initials: string; color: string;
  goal: string; plan: string; sessions: number; progress: number;
  status: string; nextSession: string; joined: string; rating: number;
}

@Component({
  selector: 'app-clients',
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  searchQuery = '';
  filterStatus = 'all';

  clients: Client[] = [
    { id: 1, name: 'Amina Benali', initials: 'AB', color: '#6366f1', goal: 'Perte de poids', plan: 'Premium', sessions: 24, progress: 75, status: 'Actif', nextSession: 'Demain 09h', joined: 'Jan 2025', rating: 5 },
    { id: 2, name: 'Lucas Martin', initials: 'LM', color: '#10b981', goal: 'Prise de masse', plan: 'Premium', sessions: 18, progress: 60, status: 'Actif', nextSession: 'Lun 14h', joined: 'Fév 2025', rating: 4.8 },
    { id: 3, name: 'Sofia Reyes', initials: 'SR', color: '#f59e0b', goal: 'Endurance', plan: 'Standard', sessions: 31, progress: 88, status: 'Actif', nextSession: 'Mer 10h', joined: 'Nov 2024', rating: 5 },
    { id: 4, name: 'Karim Ouali', initials: 'KO', color: '#ef4444', goal: 'Musculation', plan: 'Basic', sessions: 12, progress: 45, status: 'En pause', nextSession: '-', joined: 'Mar 2025', rating: 4.2 },
    { id: 5, name: 'Chloé Dupont', initials: 'CD', color: '#8b5cf6', goal: 'Yoga & Souplesse', plan: 'Premium', sessions: 28, progress: 92, status: 'Actif', nextSession: 'Ven 11h', joined: 'Déc 2024', rating: 4.9 },
    { id: 6, name: 'Thomas Bernard', initials: 'TB', color: '#0ea5e9', goal: 'Cardio', plan: 'Standard', sessions: 9, progress: 35, status: 'Actif', nextSession: 'Jeu 17h', joined: 'Avr 2025', rating: 4.5 },
  ];

  get filtered() {
    return this.clients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = this.filterStatus === 'all' || c.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }
}
