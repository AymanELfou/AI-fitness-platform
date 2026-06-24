import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Abonnement {
  id: number;
  type: string;
  price: number;
  duration: number;
  description: string;
  clubId: number;
  clubName: string;
}
export interface AbonnementRequest {
  type: string;
  price: number;
  duration: number;
  description: string;
  clubId: number;
}


@Injectable({
  providedIn: 'root'
})
export class AbonnementService {
  private apiUrl = 'http://localhost:8082/api/v1/abonnements';

  constructor(private http: HttpClient) {}

  getByClubId(clubId: number): Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(`${this.apiUrl}/club/${clubId}`);
  }

  create(abonnement: AbonnementRequest): Observable<Abonnement> {
    return this.http.post<Abonnement>(this.apiUrl, abonnement);
  }
}
