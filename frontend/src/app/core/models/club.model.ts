export interface Club {
  id: number;
  createdAt?: string;
  userId?: number;
  clubName: string;
  localisation: string;
  capacity: number;
  contactEmail: string;
  phone: string;
  subscriptionPlan?: string;
}

// Backward compatibility alias
export type club = Club;