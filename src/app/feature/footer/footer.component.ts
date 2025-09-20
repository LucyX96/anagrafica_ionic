import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IonCol, IonContent, IonGrid, IonIcon, IonModal, IonRippleEffect, IonRow, IonText } from "@ionic/angular/standalone";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrls: ['./footer.component.scss'],
  imports: [IonText, IonRippleEffect, IonCol, IonRow, IonGrid, IonIcon, MatIcon, IonContent, IonModal]
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
