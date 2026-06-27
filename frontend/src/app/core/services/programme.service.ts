import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProgrammeResponse {
  id: number;
  createdAt?: string;
  title: string;
  description?: string;
  duration: number;
  level: string;
  objective: string;
  isGeneratedByAI: boolean;
  isValidatedByCoach: boolean;
  coachId: number;
  coachName?: string;
  exerciseIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService {
  private apiUrl = 'http://localhost:8082/api/v1/programmes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProgrammeResponse[]> {
    return this.http.get<ProgrammeResponse[]>(this.apiUrl);
  }

  getByCoachId(coachId: number): Observable<ProgrammeResponse[]> {
    return this.http.get<ProgrammeResponse[]>(`${this.apiUrl}/coach/${coachId}`);
  }
}
