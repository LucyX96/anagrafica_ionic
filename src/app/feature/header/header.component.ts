import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonText } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonText, IonIcon]
})

export class HeaderComponent implements OnInit {

  loggedIn = false;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    if (this.authService.loggedIn$.subscribe(value => this.loggedIn = value)) {
      this.router.navigateByUrl('/home');
    }
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  toggleMenu() {
    throw new Error('Method not implemented.');
  }

  logout() {
    if (this.authService.isLoggedIn()) {
      console.log('Logout');
      this.authService.setLoggedIn(false);
      this.router.navigateByUrl('/home');
    }
  }

}
