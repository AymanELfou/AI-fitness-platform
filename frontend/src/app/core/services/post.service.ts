import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PostRequest {
  content: string;
  imageUrl?: string;
  communityId: number;
  userId: number;
}

export interface PostResponse {
  id: number;
  createdAt: string;
  content: string;
  imageUrl?: string;
  communityId: number;
  userId: number;
  userName?: string;
  commentsCount: number;
  likesCount: number;
  userRole?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8082/api/v1/posts';

  constructor(private http: HttpClient) {}

  create(userId: number, request: PostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(`${this.apiUrl}/${userId}`, request);
  }

  getById(id: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.apiUrl}/${id}`);
  }

  getByCommunityId(communityId: number): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.apiUrl}/community/${communityId}`);
  }

  getByUserId(userId: number): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  update(id: number, request: PostRequest): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
