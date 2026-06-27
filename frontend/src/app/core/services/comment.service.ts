import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommentRequest {
  content: string;
  postId: number;
}

export interface CommentResponse {
  id: number;
  createdAt: string;
  content: string;
  postId: number;
  userId: number;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8082/api/v1/comments';

  constructor(private http: HttpClient) {}

  createComment(userId: number, request: CommentRequest): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}/${userId}`, request);
  }

  getCommentsByPostId(postId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.apiUrl}/post/${postId}`);
  }

  getCommentsByUserId(userId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateComment(id: number, request: CommentRequest): Observable<CommentResponse> {
    return this.http.put<CommentResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
