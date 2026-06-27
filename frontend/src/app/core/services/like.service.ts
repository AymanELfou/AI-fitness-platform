import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LikeResponse {
  id: number;
  postId: number;
  userId: number;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:8082/api/v1/likes';

  constructor(private http: HttpClient) {}

  toggleLike(postId: number, userId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/toggle/${postId}/${userId}`, {}, { responseType: 'text' });
  }

  getLikesByPostId(postId: number): Observable<LikeResponse[]> {
    return this.http.get<LikeResponse[]>(`${this.apiUrl}/post/${postId}`);
  }

  getLikesCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/post/${postId}/count`);
  }
}
