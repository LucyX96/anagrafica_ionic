import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon, IonChip, IonCardSubtitle, IonCard, IonCardContent, IonRow, IonItem } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonButton
]
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

}
