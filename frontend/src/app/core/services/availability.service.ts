import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AvailabilityRequest {
  coachId: number;
  startTime: string; // ISO 8601 format
  endTime: string;
}

export interface AvailabilityResponse {
  id: number;
  coachId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = 'http://localhost:8082/api/v1/availabilities';

  constructor(private http: HttpClient) {}

  create(request: AvailabilityRequest): Observable<AvailabilityResponse> {
    return this.http.post<AvailabilityResponse>(this.apiUrl, request);
  }

  getByCoachId(coachId: number): Observable<AvailabilityResponse[]> {
    return this.http.get<AvailabilityResponse[]>(`${this.apiUrl}/coach/${coachId}`);
  }

  getFreeSlots(coachId: number): Observable<AvailabilityResponse[]> {
    return this.http.get<AvailabilityResponse[]>(`${this.apiUrl}/coach/${coachId}/free`);
  }

  update(id: number, request: AvailabilityRequest): Observable<AvailabilityResponse> {
    return this.http.put<AvailabilityResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
