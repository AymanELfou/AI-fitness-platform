import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ── Response DTO ───────────────────────────────────────────────────────────────

export interface SeanceResponse {
  id: number;
  createdAt?: string;
  status: string;
  duration: number;       // en minutes
  notes?: string;
  coachId: number;
  coachName?: string;
  programmeId: number;
  programmeTitle?: string;
}

// ── Request DTO ────────────────────────────────────────────────────────────────

export interface SeanceRequest {
  status: string;
  duration: number;
  notes?: string;
  coachId: number;
  programmeId: number;
}

// ── Service ────────────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class SeanceService {
  private apiUrl = 'http://localhost:8082/api/v1/seances';

  constructor(private http: HttpClient) { }

  getAll(): Observable<SeanceResponse[]> {
    return this.http.get<SeanceResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<SeanceResponse> {
    return this.http.get<SeanceResponse>(`${this.apiUrl}/${id}`);
  }

  getByCoachId(coachId: number): Observable<SeanceResponse[]> {
    return this.http.get<SeanceResponse[]>(`${this.apiUrl}/coach/${coachId}`);
  }

  getByProgrammeId(programmeId: number): Observable<SeanceResponse[]> {
    return this.http.get<SeanceResponse[]>(`${this.apiUrl}/programme/${programmeId}`);
  }

  getByStatus(status: string): Observable<SeanceResponse[]> {
    return this.http.get<SeanceResponse[]>(`${this.apiUrl}/status/${status}`);
  }

  create(request: SeanceRequest): Observable<SeanceResponse> {
    return this.http.post<SeanceResponse>(this.apiUrl, request);
  }

  update(id: number, request: SeanceRequest): Observable<SeanceResponse> {
    return this.http.put<SeanceResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
