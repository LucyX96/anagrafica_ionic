import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequestInterface } from '../model/user-login-interface';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  // private apiUrl = 'http://localhost:8081'; // URL backend
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequestInterface): Observable<string> {
    return this.http.post(this.apiUrl + "/api/auth/login", request, { responseType: 'text', withCredentials: true  });
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}
