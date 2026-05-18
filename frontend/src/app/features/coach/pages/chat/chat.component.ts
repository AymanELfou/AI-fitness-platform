import { Component, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  text: string;
  sender: 'coach' | 'client';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: number;
  name: string;
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  goal: string;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  newMessage = '';
  selectedContact: Contact | null = null;

  contacts: Contact[] = [
    { id: 1, name: 'Amina Benali', initials: 'AB', color: '#6366f1', lastMessage: 'Merci coach ! À demain 💪', time: '09:32', unread: 2, online: true, goal: 'Perte de poids' },
    { id: 2, name: 'Lucas Martin', initials: 'LM', color: '#10b981', lastMessage: 'J\'ai terminé le programme W2', time: '08:15', unread: 0, online: true, goal: 'Prise de masse' },
    { id: 3, name: 'Sofia Reyes', initials: 'SR', color: '#f59e0b', lastMessage: 'Est-ce que je peux décaler mercredi ?', time: 'Hier', unread: 1, online: false, goal: 'Endurance' },
    { id: 4, name: 'Karim Ouali', initials: 'KO', color: '#ef4444', lastMessage: 'Ok je vais essayer', time: 'Hier', unread: 0, online: false, goal: 'Musculation' },
    { id: 5, name: 'Chloé Dupont', initials: 'CD', color: '#8b5cf6', lastMessage: 'Super séance aujourd\'hui !', time: 'Lun', unread: 0, online: true, goal: 'Yoga & Souplesse' },
  ];

  conversationMap: Record<number, Message[]> = {
    1: [
      { id: 1, text: 'Bonjour Amina ! Comment vous sentez-vous après la séance d\'hier ?', sender: 'coach', time: '09:00', status: 'read' },
      { id: 2, text: 'Bonjour coach ! Ça va mieux, j\'avais un peu de courbatures mais je me suis bien étirée le soir 😊', sender: 'client', time: '09:15' },
      { id: 3, text: 'Parfait ! N\'oubliez pas de bien vous hydrater. Pour demain, on attaque le programme semaine 3.', sender: 'coach', time: '09:20', status: 'read' },
      { id: 4, text: 'Oui ! J\'ai regardé le planning, ça a l\'air intense 😅', sender: 'client', time: '09:28' },
      { id: 5, text: 'Vous êtes prête ! On y va à votre rythme. On commence à 9h ?', sender: 'coach', time: '09:30', status: 'read' },
      { id: 6, text: 'Merci coach ! À demain 💪', sender: 'client', time: '09:32' },
    ],
    2: [
      { id: 1, text: 'Lucas, bravo pour votre constance cette semaine !', sender: 'coach', time: '08:00', status: 'read' },
      { id: 2, text: 'J\'ai terminé le programme W2', sender: 'client', time: '08:15' },
    ],
    3: [
      { id: 1, text: 'Sofia, j\'ai mis à jour votre plan d\'endurance.', sender: 'coach', time: 'Hier', status: 'read' },
      { id: 2, text: 'Est-ce que je peux décaler mercredi ?', sender: 'client', time: 'Hier' },
    ],
    4: [
      { id: 1, text: 'Karim, pensez à faire vos exercices de mobilité.', sender: 'coach', time: 'Hier', status: 'read' },
      { id: 2, text: 'Ok je vais essayer', sender: 'client', time: 'Hier' },
    ],
    5: [
      { id: 1, text: 'Excellent travail aujourd\'hui Chloé !', sender: 'coach', time: 'Lun', status: 'read' },
      { id: 2, text: 'Super séance aujourd\'hui !', sender: 'client', time: 'Lun' },
    ],
  };

  get onlineCount(): number {
    return this.contacts.filter(c => c.online).length;
  }

  get messages(): Message[] {
    if (!this.selectedContact) return [];
    return this.conversationMap[this.selectedContact.id] || [];
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
    contact.unread = 0;
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedContact) return;
    const id = this.selectedContact.id;
    const msg: Message = {
      id: Date.now(),
      text: this.newMessage.trim(),
      sender: 'coach',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    this.conversationMap[id] = [...(this.conversationMap[id] || []), msg];
    this.contacts.find(c => c.id === id)!.lastMessage = msg.text;
    this.newMessage = '';
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      if (this.messagesEnd) {
        this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch {}
  }
}
