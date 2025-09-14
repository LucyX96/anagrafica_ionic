import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponseInterface, LoginRequestInterface } from '../model/user-login-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  private apiUrl = 'http://localhost:8081'; // URL backend

  constructor(private http: HttpClient) { }

  login(request: LoginRequestInterface): Observable<AuthResponseInterface> {
    return this.http.post<AuthResponseInterface>(this.apiUrl + "/api/auth/login", request);
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
