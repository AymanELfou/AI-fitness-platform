import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ── Response DTOs ──────────────────────────────────────────────────────────────

export interface ProgrammeResponse {
  id: number;
  createdAt?: string;
  title: string;
  description?: string;
  duration: number;         // en semaines
  level: string;
  objective: string;
  isGeneratedByAI: boolean;
  isValidatedByCoach: boolean;
  coachId: number;
  coachName?: string;
  exerciseIds?: number[];
  clientIds?: number[];     // clients assignés
}

// ── Request DTO ────────────────────────────────────────────────────────────────

export interface ProgrammeRequest {
  title: string;
  description?: string;
  duration: number;
  level: string;
  objective: string;
  isGeneratedByAI: boolean;
  coachId: number;
  exerciseIds: number[];
  clientIds?: number[];     // optionnel
}

// ── Service ────────────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService {
  private apiUrl = 'http://localhost:8082/api/v1/programmes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProgrammeResponse[]> {
    return this.http.get<ProgrammeResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProgrammeResponse> {
    return this.http.get<ProgrammeResponse>(`${this.apiUrl}/${id}`);
  }

  getByCoachId(coachId: number): Observable<ProgrammeResponse[]> {
    return this.http.get<ProgrammeResponse[]>(`${this.apiUrl}/coach/${coachId}`);
  }

  getValidated(): Observable<ProgrammeResponse[]> {
    return this.http.get<ProgrammeResponse[]>(`${this.apiUrl}/validated`);
  }

  create(request: ProgrammeRequest): Observable<ProgrammeResponse> {
    return this.http.post<ProgrammeResponse>(this.apiUrl, request);
  }

  update(id: number, request: ProgrammeRequest): Observable<ProgrammeResponse> {
    return this.http.put<ProgrammeResponse>(`${this.apiUrl}/${id}`, request);
  }

  assignClients(id: number, clientIds: number[]): Observable<ProgrammeResponse> {
    return this.http.patch<ProgrammeResponse>(`${this.apiUrl}/${id}/assign-clients`, clientIds);
  }

  validate(id: number): Observable<ProgrammeResponse> {
    return this.http.patch<ProgrammeResponse>(`${this.apiUrl}/${id}/validate`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
