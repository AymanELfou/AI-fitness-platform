import { computed, Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role, User } from '../models/user.model';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, RegisterRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  // Reactive signals to store authentication state
  private _currentUser = signal<User | null>(null);
  private _isLoggedIn = signal<boolean>(false);

  // Readonly computed signals exposed to components
  currentUser = computed(() => this._currentUser());
  isLoggedIn = computed(() => this._isLoggedIn());

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {
    // Load user and token data from localStorage when service starts
    this.loadUserFromStorage();
  }

  /**
  * Load authentication data from localStorage
  * and restore user session after page refresh
  */

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userStr = localStorage.getItem(this.USER_KEY);

      if (token) {
        this._isLoggedIn.set(true);
        if (userStr) {
          try {
            const user: User = JSON.parse(userStr);
            this._currentUser.set(user);
          } catch {
            // Do not clear storage if userStr parsing fails, just keep token
          }
        } else {
          // If no userStr but token exists, we can still try to decode basic info from token
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user: any = { id: payload.userId, email: payload.sub, roles: payload.roles || payload.authorities || [] };
            this._currentUser.set(user);
          } catch (e) { }
        }
      }
    }
  }

  /**
   * Handle successful authentication
   * Save token and user information in localStorage
   */
  private handleAuthSuccess(response: AuthResponse): void {
    if (response && response.token) {
      // Store JWT token
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        if (response.user) {
          // Store full user object returned from backend
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this._currentUser.set(response.user);
        } else {
          // Backend might only return a token, try to decode user from token
          try {
            const payload = JSON.parse(atob(response.token.split('.')[1]));
            console.log('JWT Payload complet:', payload);

            const user: any = { id: payload.userId, email: payload.sub, roles: payload.roles || payload.authorities || [] };
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));


            this._currentUser.set(user);
            console.log(user);

          } catch (e) { }
        }
      }
      this._isLoggedIn.set(true);
    }
  }


  /** LOGIN */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.api.AUTH.LOGIN, credentials).pipe(
      tap((response: AuthResponse) => this.handleAuthSuccess(response)),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }

  /** REGISTER */
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(this.api.AUTH.REGISTER, data).pipe(
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  }

  /** LOGOUT */
  logout(): void {
    this.http.post(this.api.AUTH.LOGOUT, {}).pipe(
      catchError(error => {
        console.error('Logout error on backend:', error);
        return throwError(() => new Error('Logout failed on backend'));
      })
    ).subscribe({
      next: () => {
        // Clear local data and redirect to login page
        this.clearStorage();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Even if backend fails, clear local state
        this.clearStorage();
        this.router.navigate(['/login']);
      }
    });
  }

  //Remove authentication data from localStorage
  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this._currentUser.set(null);
    this._isLoggedIn.set(false);
  }

  //Get JWT token from localStorage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  //Set the authenticated user and store user data in localStorage
  setUser(user: User): void {
    this._currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this._currentUser.set(user);
      this._isLoggedIn.set(true);
    }
  }

  //Check if current user has a specific role
  hasRole(role: Role): boolean {
    return this._currentUser()?.roles?.includes(role) ?? false;
  }

  //Redirect authenticated user
  redirectByRole(): void {
    const user = this._currentUser();
    if (!user) return;

    if (user.roles.includes(Role.ROLE_ADMIN)) {
      this.router.navigate(['/admin/dashboard']);
    } else if (user.roles.includes(Role.ROLE_CLUB)) {
      this.router.navigate(['/club/dashboard']);
    } else if (user.roles.includes(Role.ROLE_COACH)) {
      this.router.navigate(['/coach/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }




}
