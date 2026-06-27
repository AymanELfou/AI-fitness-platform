import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, User } from '../models/user.model';

export type AdminUserStatus = 'active' | 'inactive' | 'banned' | 'pending';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = 'http://localhost:8082/api/v1/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  activateUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  lockUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/lock`, {});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPrimaryRole(user: User): 'admin' | 'coach' | 'club' | 'client' {
    const role = user.roles?.[0];
    const map: Record<Role, 'admin' | 'coach' | 'club' | 'client'> = {
      [Role.ROLE_ADMIN]: 'admin',
      [Role.ROLE_CLIENT]: 'client',
      [Role.ROLE_COACH]: 'coach',
      [Role.ROLE_CLUB]: 'club'
    };
    return role ? map[role] : 'client';
  }

  getStatus(user: User): AdminUserStatus {
    if (user.accountLocked) return 'banned';
    if (!user.enabled) return user.profileCompleted === false ? 'pending' : 'inactive';
    return 'active';
  }
}
