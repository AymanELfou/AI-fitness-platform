export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roles: Role[];
  enabled: boolean;
  accountLocked: boolean;
  createdDate: string;
  modifiedDate?: string;
}

export enum Role {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_CLIENT = 'ROLE_CLIENT',
  ROLE_COACH = 'ROLE_COACH',
  ROLE_CLUB = 'ROLE_CLUB'
}