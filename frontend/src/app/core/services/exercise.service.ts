import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = 'http://localhost:8082/api/v1/exercises';

  constructor(private http: HttpClient) { }

  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl);
  }

  getAdminExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/admin`);
  }

  getExerciseById(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  getByDifficulty(difficulty: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/difficulty/${difficulty}`);
  }

  getByMusclesGroup(musclesGroup: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/muscles/${musclesGroup}`);
  }
}
