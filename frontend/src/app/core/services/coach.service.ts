import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CoachProfileResponse {
  id: number;
  createdAt?: string;
  experience: number;
  certifications: string;
  speciality: string;
  tariff: number;
  rating: number;
  clubId?: number;
  clubName?: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private apiUrl = 'http://localhost:8082/api/v1/coaches';

  constructor(private http: HttpClient) { }

  getAllCoaches(): Observable<CoachProfileResponse[]> {
    return this.http.get<CoachProfileResponse[]>(this.apiUrl);
  }

  // getAllByClubId du backend
  getCoachesByClubId(clubId: number): Observable<CoachProfileResponse[]> {
    return this.http.get<CoachProfileResponse[]>(`${this.apiUrl}/club/${clubId}`);
  }

  getCoachById(id: number): Observable<CoachProfileResponse> {
    return this.http.get<CoachProfileResponse>(`${this.apiUrl}/${id}`);
  }

  createCoachProfile(userId: number, profileData: any): Observable<CoachProfileResponse> {
    return this.http.post<CoachProfileResponse>(`${this.apiUrl}/${userId}/profile`, profileData);
  }

  updateCoachProfile(id: number, profileData: any): Observable<CoachProfileResponse> {
    return this.http.put<CoachProfileResponse>(`${this.apiUrl}/${id}`, profileData);
  }

  deleteCoachProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
