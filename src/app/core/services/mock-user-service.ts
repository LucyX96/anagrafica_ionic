import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoginRequestInterface } from '../model/user-login-interface';
import { UserLoginService } from './user-login.service';

@Injectable({
  providedIn: 'root',
})
export class MockUserLoginService extends UserLoginService {
  // Sovrascriviamo il costruttore per non avere bisogno di HttpClient
  constructor() {
    // Chiamiamo super() ma senza argomenti, dato che non useremo http
    super(null!); // Il '!' e 'null' indicano a TypeScript che gestiamo noi la dipendenza
  }

  // Sovrascriviamo il metodo di login
  override login(request: LoginRequestInterface): Observable<string> {
    console.log('%c MOCK LOGIN ATTIVO ', 'background: #E63946; color: #F1FAEE; font-weight: bold; padding: 4px;');
    console.log('Dati ricevuti:', request);

    // Simuliamo un utente e password validi per la demo
    if (request.username === 'demo' && request.password === 'demo') {
      // Simuliamo una risposta di successo dal server dopo 1 secondo
      return of('fake-jwt-token-for-demo-user').pipe(delay(1000));
    } else {
      // Simuliamo un errore per credenziali errate
      return throwError(() => new Error('Invalid credentials (mock error)')).pipe(delay(1000));
    }
  }

  // Non abbiamo bisogno di sovrascrivere gli altri metodi
  // se non li usiamo in questo flusso (saveToken, getToken, etc.)
}