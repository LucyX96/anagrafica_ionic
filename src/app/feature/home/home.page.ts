import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, MatIconModule],
})
export class HomePage {
  constructor(private router: Router) { }

  ngOnInit(): void { }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
