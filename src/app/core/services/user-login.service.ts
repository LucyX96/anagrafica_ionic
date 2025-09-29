import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponseInterface, LoginRequestInterface, RegisterRequestInterface, RegisterResponseInterface } from '../model/user-login-interface';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  // private apiUrl = 'http://localhost:8081'; // URL backend
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequestInterface): Observable<AuthResponseInterface> {
    return this.http.post<AuthResponseInterface>(this.apiUrl + "/api/auth/login", request, { withCredentials: true  });
  }

  register(request: RegisterRequestInterface): Observable<RegisterResponseInterface> {
    return this.http.post<RegisterResponseInterface>(this.apiUrl + "/api/auth/register", request);
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  saveName(name: string): void {
    localStorage.setItem('name', name);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getName(): string | null {
    return localStorage.getItem('name');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}
