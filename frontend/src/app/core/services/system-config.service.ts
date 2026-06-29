import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface SystemConfig {
  id: number;
  maintenanceMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService {
  private apiUrl = 'http://localhost:8082/api/v1/config';
  private configSubject = new BehaviorSubject<SystemConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<SystemConfig> {
    return this.http.get<SystemConfig>(this.apiUrl).pipe(
      tap(config => this.configSubject.next(config))
    );
  }

  getCurrentConfig(): SystemConfig | null {
    return this.configSubject.value;
  }

  updateMaintenanceMode(enabled: boolean): Observable<SystemConfig> {
    return this.http.put<SystemConfig>(`${this.apiUrl}/maintenance?enabled=${enabled}`, {}).pipe(
      tap(config => this.configSubject.next(config))
    );
  }
}
