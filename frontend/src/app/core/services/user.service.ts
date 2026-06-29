import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface UserUpdateRequest {
  firstname: string;
  lastname: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api/v1/users';

  constructor(private http: HttpClient) {}

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateMe(request: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, request);
  }
}
