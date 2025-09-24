import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IonCol, IonContent, IonGrid, IonIcon, IonModal, IonRippleEffect, IonRow, IonText, IonTabBar, IonTabButton, IonTabs, IonBadge, IonLabel } from "@ionic/angular/standalone";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrls: ['./footer.component.scss'],
  imports: [IonRippleEffect, IonCol, IonRow, IonGrid, IonIcon, MatIcon, IonContent, IonModal, IonLabel]
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) {

  }

  ngOnInit() {
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
