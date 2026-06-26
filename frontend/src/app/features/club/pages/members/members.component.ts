import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientService } from '../../../../core/services/client.service';
import { ClubService } from '../../../../core/services/club.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  members: Client[] = [];
  searchTerm: string = '';

  get filteredMembers(): Client[] {
    if (!this.searchTerm.trim()) {
      return this.members;
    }
    const lowerSearch = this.searchTerm.toLowerCase();
    return this.members.filter(m => 
      (m.userName && m.userName.toLowerCase().includes(lowerSearch)) ||
      (m.but && m.but.toLowerCase().includes(lowerSearch))
    );
  }

  isModalOpen = false;
  isEditMode = false;
  currentMember: Partial<Client> = {};
  clubId?: number;

  constructor(
    private clientService: ClientService,
    private clubService: ClubService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.clubService.getClubByUserId(user.id).subscribe({
        next: (club) => {
          if (club && club.id) {
            this.clubId = club.id;
            this.loadMembers();
          }
        }
      });
    }
  }

  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  isDeleteConfirmOpen = false;
  memberToDelete: Client | null = null;

  loadMembers() {
    if (this.clubId) {
      this.isLoading = true;
      this.clientService.getClientsByClubId(this.clubId).subscribe({
        next: (data) => {
          this.members = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.showNotification('Failed to load club members list.', 'error');
        }
      });
    }
  }

  showNotification(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => this.successMessage = null, 4000);
    } else {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = null, 5000);
    }
  }

  openModal(member?: Client) {
    if (member) {
      this.isEditMode = true;
      this.currentMember = Object.assign({}, member);
    } else {
      this.isEditMode = false;
      this.currentMember = { userName: '', but: '', niveau: '', age: 0, poids: 0, taille: 0 };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveMember() {
    if (!this.currentMember.userName || !this.currentMember.but) {
      this.showNotification("Please fill in required fields!", "error");
      return;
    }

    this.isLoading = true;
    if (this.isEditMode && this.currentMember.id) {
      this.clientService.updateClient(this.currentMember.id, this.currentMember).subscribe({
        next: () => {
          this.isLoading = false;
          this.closeModal();
          this.showNotification('Member profile updated successfully!', 'success');
          this.loadMembers();
        },
        error: (err) => {
          this.isLoading = false;
          this.showNotification('Failed to update member: ' + (err.error?.message || err.message), 'error');
        }
      });
    } else {
      this.currentMember.id = Date.now();
      this.members.unshift(this.currentMember as Client);
      this.isLoading = false;
      this.closeModal();
    }
  }

  confirmDeleteMember(member: Client) {
    this.memberToDelete = member;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirm() {
    this.isDeleteConfirmOpen = false;
    this.memberToDelete = null;
  }

  executeDeleteMember() {
    if (this.memberToDelete && this.memberToDelete.id) {
      this.isLoading = true;
      this.clientService.deleteClient(this.memberToDelete.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.closeDeleteConfirm();
          this.showNotification('Member profile deleted successfully!', 'success');
          this.loadMembers();
        },
        error: (err) => {
          this.isLoading = false;
          this.closeDeleteConfirm();
          this.showNotification('Failed to delete member: ' + (err.error?.message || err.message), 'error');
        }
      });
    }
  }

  deleteMember(id: number) {
    const member = this.members.find(m => m.id === id);
    if (member) {
      this.confirmDeleteMember(member);
    }
  }
}