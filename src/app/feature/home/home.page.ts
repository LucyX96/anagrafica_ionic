import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon],
})
export class HomePage {
  constructor(private router: Router) { }

  ngOnInit(): void { }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
