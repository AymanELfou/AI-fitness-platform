import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported here

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule], // Standard standalone config
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  posts: Post[] = [
    { id: 1, title: 'Ramadan Timing Changes 🌙', content: 'Please note the club will open from 3:00 PM until 2:00 AM during the holy month. Special HIIT sessions before Iftar!', date: 'June 5, 2026', category: 'Announcement' },
    { id: 2, title: 'Upcoming Crossfit Tournament 🏆', content: 'Register at the front desk for our annual summer challenge. Big prizes for top 3 winners!', date: 'June 3, 2026', category: 'Event' }
  ];

  isModalOpen = false;
  newPost: Post = this.getEmptyPost();

  constructor() {}
  ngOnInit(): void {}

  getEmptyPost(): Post {
    return {
      id: 0,
      title: '',
      content: '',
      date: '',
      category: 'Announcement'
    };
  }

  openModal() {
    this.newPost = this.getEmptyPost();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  savePost() {
    if (!this.newPost.title || !this.newPost.content) {
      alert('Please fill in all post fields!');
      return;
    }

    // Format current date cleanly
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    this.newPost.date = new Date().toLocaleDateString('en-US', options);
    this.newPost.id = Date.now();

    // Prepend the new post to show on top of the list
    this.posts.unshift(this.newPost);
    this.closeModal();
  }
}