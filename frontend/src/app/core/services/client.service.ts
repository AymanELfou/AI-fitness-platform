import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8082/api/v1/clients';

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}/profile`);
  }

  getClientByUserId(userId: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/user/${userId}/profile`);
  }

  createClient(userId: number, clientData: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/${userId}/profile`, clientData);
  }

  updateClient(id: number, clientData: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}/profile`, clientData);
  }

  // upgradeToPremium exige le clubId et le coachId
  upgradeToPremium(userId: number, clubId?: number, coachId?: number): Observable<Client> {
    let url = `${this.apiUrl}/${userId}/upgrade`;
    const params: any = {};
    if (clubId !== undefined && clubId !== null) {
      params.clubId = clubId.toString();
    }
    if (coachId !== undefined && coachId !== null) {
      params.coachId = coachId.toString();
    }
    return this.http.patch<Client>(url, {}, { params });
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/profile`);
  }
}
