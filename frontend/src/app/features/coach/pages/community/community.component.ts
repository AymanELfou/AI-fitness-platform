import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-community',
  imports: [CommonModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class CommunityComponent {
  posts = [
    {
      author: 'Amina Benali', initials: 'AB', color: '#6366f1',
      time: 'Il y a 2h', content: 'Je viens de terminer ma séance de HIIT ! 🔥 45 minutes non-stop, merci coach pour la motivation !',
      likes: 12, comments: 3, liked: false
    },
    {
      author: 'Lucas Martin', initials: 'LM', color: '#10b981',
      time: 'Il y a 5h', content: 'Nouveau record personnel au squat : 120kg x 5 ! 💪 La progression est réelle grâce au programme.',
      likes: 24, comments: 7, liked: true
    },
    {
      author: 'Sofia Reyes', initials: 'SR', color: '#f59e0b',
      time: 'Hier', content: 'Quelqu\'un a des conseils pour améliorer sa récupération après un semi-marathon ? J\'ai couru mon premier dimanche !',
      likes: 8, comments: 11, liked: false
    },
    {
      author: 'Chloé Dupont', initials: 'CD', color: '#8b5cf6',
      time: 'Hier', content: 'La séance de yoga de ce matin m\'a complètement transformée. Je recommande à tout le monde d\'essayer le Yin Yoga 🧘‍♀️',
      likes: 15, comments: 4, liked: false
    },
  ];

  toggleLike(post: any) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }
}
