import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.scss'
})
export class NutritionComponent {
  activeTab = 'healthy';

  tabs = [
    { id: 'healthy', label: 'Healthy Eating' },
    { id: 'lose_fat', label: 'Lose Fat' },
    { id: 'gain_mass', label: 'Gain Mass' }
  ];

  articles: Record<string, any[]> = {
    'healthy': [
      {
        title: '10 Superfoods to Boost Your Energy',
        excerpt: 'Discover the top 10 nutrient-dense foods that will keep you energized throughout the day and improve your overall well-being.',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
        category: 'Healthy Eating',
        date: 'May 1, 2026',
        readTime: '5 min read'
      },
      {
        title: 'The Ultimate Guide to Meal Prep',
        excerpt: 'Save time and eat healthier by mastering the art of meal prepping. Learn how to plan, shop, and cook for the week ahead.',
        image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
        category: 'Healthy Eating',
        date: 'Apr 28, 2026',
        readTime: '7 min read'
      },
      {
        title: 'Hydration: How Much Water Do You Really Need?',
        excerpt: 'Water is essential for life, but how much should you be drinking? We break down hydration myths and facts.',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80',
        category: 'Healthy Eating',
        date: 'Apr 20, 2026',
        readTime: '4 min read'
      }
    ],
    'lose_fat': [
      {
        title: 'Understanding Caloric Deficit',
        excerpt: 'The fundamental principle of weight loss explained simply. Learn how to calculate your needs and create a sustainable deficit.',
        image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80',
        category: 'Lose Fat',
        date: 'May 3, 2026',
        readTime: '6 min read'
      },
      {
        title: 'High-Protein Snacks for Fat Loss',
        excerpt: 'Stay full and preserve muscle while losing fat with these delicious, high-protein snack ideas that you can make in minutes.',
        image: 'https://images.unsplash.com/photo-1554508498-8e68e4cb310a?auto=format&fit=crop&w=800&q=80',
        category: 'Lose Fat',
        date: 'Apr 25, 2026',
        readTime: '4 min read'
      }
    ],
    'gain_mass': [
      {
        title: 'The Clean Bulk: How to Build Muscle Without Excess Fat',
        excerpt: 'Bulking doesn\'t mean eating everything in sight. Learn the strategies for a clean bulk to maximize muscle gains.',
        image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?auto=format&fit=crop&w=800&q=80',
        category: 'Gain Mass',
        date: 'May 5, 2026',
        readTime: '8 min read'
      },
      {
        title: 'Best Supplements for Muscle Growth',
        excerpt: 'From creatine to whey protein, we review the scientifically proven supplements that can help you pack on mass.',
        image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=800&q=80',
        category: 'Gain Mass',
        date: 'Apr 22, 2026',
        readTime: '6 min read'
      },
      {
        title: 'Pre and Post-Workout Nutrition',
        excerpt: 'Optimize your performance and recovery by timing your meals correctly around your training sessions.',
        image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80',
        category: 'Gain Mass',
        date: 'Apr 15, 2026',
        readTime: '5 min read'
      }
    ]
  };

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }
}
