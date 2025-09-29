import { UserLoginService } from 'src/app/core/services/user-login.service';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }
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
