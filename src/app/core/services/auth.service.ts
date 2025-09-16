import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  // Setter
  setLoggedIn(value: boolean) {
    this.loggedInSubject.next(value);
  }

  // Getter sincrono
  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
