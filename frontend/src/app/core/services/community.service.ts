import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommunityRequest {
  name: string;
  description: string;
  clubId: number;
}

export interface CommunityResponse {
  id: number;
  name: string;
  description: string;
  clubId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = 'http://localhost:8082/api/v1/communities';

  constructor(private http: HttpClient) {}

  create(community: CommunityRequest): Observable<CommunityResponse> {
    return this.http.post<CommunityResponse>(this.apiUrl, community);
  }

  getByClubId(clubId: number): Observable<CommunityResponse> {
    return this.http.get<CommunityResponse>(`${this.apiUrl}/club/${clubId}`);
  }
}
