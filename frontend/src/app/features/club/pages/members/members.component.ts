import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Member {
  id: number;
  name: string;
  email: string;
  coachName: string;
  goal: string;
  progress: number;
  status: 'Active' | 'Pending' | 'Banned';
}

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  members: Member[] = [
    { id: 1, name: 'Anas Khali', email: 'anas.kh@gmail.com', coachName: 'Amine El Idrissi', goal: 'Weight Loss', progress: 75, status: 'Active' },
    { id: 2, name: 'Meriem Tazi', email: 'tazi.mimi@hotmail.com', coachName: 'Sarah Mansouri', goal: 'Muscle Gain', progress: 40, status: 'Active' },
    { id: 3, name: 'Othmane Alami', email: 'othman.alami@gmail.com', coachName: 'Unassigned', goal: 'Cardio Stamina', progress: 10, status: 'Pending' },
    { id: 4, name: 'Yassine Jabri', email: 'y.jabri@yahoo.fr', coachName: 'Karim Bennani', goal: 'Powerlifting', progress: 90, status: 'Banned' }
  ];

  isModalOpen = false;
  isEditMode = false;
  currentMember: Member = this.getEmptyMember();

  constructor() {}
  ngOnInit(): void {}

  getEmptyMember(): Member {
    return { id: 0, name: '', email: '', coachName: 'Unassigned', goal: '', progress: 0, status: 'Pending' };
  }

  openModal(member?: Member) {
    if (member) {
      this.isEditMode = true;
      this.currentMember = Object.assign({}, member);
    } else {
      this.isEditMode = false;
      this.currentMember = this.getEmptyMember();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveMember() {
    if (!this.currentMember.name || !this.currentMember.email) {
      alert("Please fill in required fields!");
      return;
    }

    if (this.isEditMode) {
      const index = this.members.findIndex(m => m.id === this.currentMember.id);
      if (index !== -1) {
        this.members[index] = this.currentMember;
      }
    } else {
      this.currentMember.id = Date.now();
      this.members.unshift(this.currentMember);
    }
    this.closeModal();
  }

  toggleBanMember(member: Member) {
    member.status = member.status === 'Banned' ? 'Active' : 'Banned';
  }

  deleteMember(id: number) {
    if (confirm("Are you sure you want to permanently delete this member?")) {
      this.members = this.members.filter(m => m.id !== id);
    }
  }
}