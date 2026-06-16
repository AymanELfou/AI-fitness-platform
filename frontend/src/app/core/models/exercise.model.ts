export interface Exercise {
  id: number;
  name: string;
  description?: string;
  musclesGroup: string;           
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  duration: number;               
  calories: number;
  series: number;
  repetition: number;
  imageUrl?: string;              //image_url
  createdAt?: string;
  createdBy?: number;
}