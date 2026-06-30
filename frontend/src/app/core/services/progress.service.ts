import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProgressResponse {
  id: number;
  createdAt?: string;
  performance: string;
  muscleMasse: number;
  fatMasse: number;
  clientId: number;
}

export interface ProgressRequest {
  performance: string;
  muscleMasse: number;
  fatMasse: number;
  clientId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = 'http://localhost:8082/api/v1/progress';

  constructor(private http: HttpClient) {}

  getByClientId(clientId: number): Observable<ProgressResponse[]> {
    return this.http.get<ProgressResponse[]>(`${this.apiUrl}/client/${clientId}`);
  }

  calculate(clientId: number): Observable<ProgressResponse> {
    return this.http.post<ProgressResponse>(`${this.apiUrl}/client/${clientId}/calculate`, {});
  }

  getById(id: number): Observable<ProgressResponse> {
    return this.http.get<ProgressResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: ProgressRequest): Observable<ProgressResponse> {
    return this.http.post<ProgressResponse>(this.apiUrl, request);
  }

  update(id: number, request: ProgressRequest): Observable<ProgressResponse> {
    return this.http.put<ProgressResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
