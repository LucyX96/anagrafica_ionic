import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonIcon,
  IonButton,
  IonCard,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonModal,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonCard,
    IonButton,
    IonIcon
],
})
export class HomePage {
  isModalOpen = false;

  @ViewChild('modal') modal!: IonModal;
  @ViewChild(IonContent) content!: IonContent;

  presentingEl!: HTMLElement;

  ngAfterViewInit() {
    // Prendi l'elemento nativo del content
    this.content.getScrollElement().then(el => {
      this.presentingEl = el;
    });
  }

  openModal() {
    this.modal.presentingElement = this.presentingEl;
    this.modal.present();
  }

  closeModal() {
    this.modal.dismiss();
  }

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
