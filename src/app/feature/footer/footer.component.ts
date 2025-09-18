import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon, IonGrid, IonRow, IonCol, IonRippleEffect } from "@ionic/angular/standalone";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrls: ['./footer.component.scss'],
  imports: [IonRippleEffect, IonCol, IonRow, IonGrid, IonIcon]
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
