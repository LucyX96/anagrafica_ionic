import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonText, IonCol, IonRow, IonGrid, IonToolbar, IonHeader, IonTitle } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { StatisticsComponent } from "../components/statistics/statistics.component";

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

  constructor(private router: Router, public authService: AuthService) {
    
  }
  
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

  goBack() {
    this.router.navigate(['/home']); // o la route che vuoi
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
