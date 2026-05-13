import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Change selon ton backend
  readonly BASE_URL = 'http://localhost:8082';

  // Endpoints auth
  readonly AUTH = {
    LOGIN: `${this.BASE_URL}/auth/login`,
    REGISTER: `${this.BASE_URL}/auth/register`,
    ACTIVATE_ACCOUNT: `${this.BASE_URL}/auth/activate-account`,
    LOGOUT: `${this.BASE_URL}/auth/logout`
  };



  constructor() { }
}
