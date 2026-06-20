export interface client {
  age: number;
  poids: number;
  taille: number;
  targetWeight: number;
  address: string;
  fitnessGoal: 'weight-loss' | 'muscle-gain';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  imc?: string;
}