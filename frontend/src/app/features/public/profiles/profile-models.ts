export interface IClientProfile {
  age: number;
  poids: number;
  taille: number;
  targetWeight: number;
  address: string;
  fitnessGoal: 'weight-loss' | 'muscle-gain';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  imc?: string;
}

export interface ICoachProfile {
  experience: number;
  speciality: string;
  tariff: number;
  availability: string;
  rating: number;
  certification: File | null;
}

export interface IClubProfile {
  clubName: string;
  address: string;
  capacity: number;
  phone: string;
  contactEmail: string;
}