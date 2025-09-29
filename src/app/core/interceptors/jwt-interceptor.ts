import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLoginService } from '../services/user-login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private userLoginService: UserLoginService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.includes('/api/auth/login') || request.url.includes('/api/auth/register')) {
      // Se è un endpoint pubblico, inoltra la richiesta senza modificarla
      return next.handle(request);
    }

    // 1. Recupera il token (es. da localStorage)
    const token = this.userLoginService.getToken();

    // 2. Se il token esiste, modifica la richiesta
    if (token) {
      // Clona la richiesta originale e aggiunge un nuovo header
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 3. Inoltra la richiesta CLONATA
      return next.handle(clonedRequest);
    }

    // 4. Se non c'è il token, inoltra la richiesta ORIGINALE senza modifiche
    return next.handle(request);
  }
}