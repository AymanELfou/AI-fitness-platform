import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Club } from '../models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = 'http://localhost:8082/api/v1/clubs';

  constructor(private http: HttpClient) { }

  getAllClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);
  }

  getClubById(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${id}/profile`);
  }

  getClubByUserId(userId: number): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/user/${userId}/profile`);
  }

  createClub(userId: number, clubData: Partial<Club>): Observable<Club> {
    return this.http.post<Club>(`${this.apiUrl}/${userId}/profile`, clubData);
  }

  updateClub(id: number, clubData: Partial<Club>): Observable<Club> {
    return this.http.put<Club>(`${this.apiUrl}/${id}/profile`, clubData);
  }

  deleteClub(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/profile`);
  }
}
