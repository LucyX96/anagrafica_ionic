import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
  IonTitle
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonText, IonIcon, IonTitle],
})
export class HeaderComponent implements OnInit {
  loggedIn = false;

  childTitle: string | null = null;
  shareText: string | null = null;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    if (
      this.authService.loggedIn$.subscribe((value) => (this.loggedIn = value))
    ) {
      this.router.navigateByUrl('/home');
    }
  }

  onChildTitleChange(title: string | null) {
    this.childTitle = title;
  }

  onChildShareTextChange(sharedText: string | null) {
    this.shareText = sharedText;
    console.log(this.shareText);
  }

  goBack() {
    this.router.navigate(['/home']); 
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
