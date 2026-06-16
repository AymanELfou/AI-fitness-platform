import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProgramStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED';

export interface Program {
  id: number;
  name: string;
  description: string;
  image: string;
  status: ProgramStatus;
  statusMeta: string;
  progress: number;
  level: string;
  tags: string[];
  daysPerWeek: number;
  duration: string;
  muscleGroup: string;
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent {

  activeFilter = signal<string>('All');
  filters = ['All', 'Upper Body', 'Lower Body', 'Shoulders', 'Chest'];

  programs: Program[] = [
    {
      id: 1,
      name: 'Upper/Lower Hypertrophy Split',
      description: 'A high-frequency upper/lower split designed to maximize muscle growth through progressive overload on compound and isolation movements.',
      image: 'images/program_upper_body.png',
      status: 'ACTIVE',
      statusMeta: 'Week 4 of 8',
      progress: 50,
      level: 'Intermediate',
      tags: ['Upper Body', 'Hypertrophy'],
      daysPerWeek: 4,
      duration: '8 Weeks',
      muscleGroup: 'Upper Body'
    },
    {
      id: 2,
      name: 'Lower Body Power Block',
      description: 'Explosive lower body sessions targeting quads, hamstrings and glutes through squats, RDLs and leg press protocols for maximum strength.',
      image: 'images/program_lower_body.png',
      status: 'UPCOMING',
      statusMeta: 'Starts Jun 15',
      progress: 0,
      level: 'Advanced',
      tags: ['Lower Body', 'Strength'],
      daysPerWeek: 3,
      duration: '6 Weeks',
      muscleGroup: 'Lower Body'
    },
    {
      id: 3,
      name: 'Shoulder Sculptor Protocol',
      description: 'Dedicated shoulder program targeting all three deltoid heads — anterior, lateral and posterior — for balanced width and definition.',
      image: 'images/program_shoulders.png',
      status: 'ACTIVE',
      statusMeta: 'Week 2 of 6',
      progress: 33,
      level: 'Intermediate',
      tags: ['Shoulders', 'Hypertrophy'],
      daysPerWeek: 2,
      duration: '6 Weeks',
      muscleGroup: 'Shoulders'
    },
    {
      id: 4,
      name: 'Chest Blast — Volume Phase',
      description: 'Volume-heavy chest accumulation block combining flat, incline and cable movements for maximum pectoral recruitment and growth.',
      image: 'images/program_chest.png',
      status: 'COMPLETED',
      statusMeta: 'Finished May 28',
      progress: 100,
      level: 'Advanced',
      tags: ['Chest', 'Volume'],
      daysPerWeek: 2,
      duration: '4 Weeks',
      muscleGroup: 'Chest'
    }
  ];

  get filteredPrograms(): Program[] {
    const f = this.activeFilter();
    return f === 'All' ? this.programs : this.programs.filter(p => p.muscleGroup === f);
  }

  get totalCount()     { return this.programs.length; }
  get activeCount()    { return this.programs.filter(p => p.status === 'ACTIVE').length; }
  get completedCount() { return this.programs.filter(p => p.status === 'COMPLETED').length; }
  get upcomingCount()  { return this.programs.filter(p => p.status === 'UPCOMING').length; }

  setFilter(f: string): void { this.activeFilter.set(f); }

  getStatusClass(s: ProgramStatus): string {
    return { ACTIVE: 'badge-active', UPCOMING: 'badge-upcoming', COMPLETED: 'badge-completed' }[s];
  }

  getProgressColor(s: ProgramStatus): string {
    return { ACTIVE: '#2563EB', UPCOMING: '#94A3B8', COMPLETED: '#22C55E' }[s];
  }

  getActionIcon(s: ProgramStatus): string {
    return { ACTIVE: 'play', UPCOMING: 'eye', COMPLETED: 'refresh' }[s];
  }
}
