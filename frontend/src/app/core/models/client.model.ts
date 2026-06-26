export interface Client {
  id?: number;
  createdAt?: string;
  userId?: number;
  age: number;
  poids: number;
  taille: number;
  but: string;
  niveau: string;
  imc?: number;
  subscriptionPlan?: 'FREEMIUM' | 'PREMIUM';
  coachID?: number;
  clubId?: number;
  //UserName to response
  userName?: string;
}

// Backward compatibility alias
export type client = Client;