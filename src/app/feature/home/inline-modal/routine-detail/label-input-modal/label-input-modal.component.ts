import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-label-input-modal',
  templateUrl: './label-input-modal.component.html',
  styleUrls: ['./label-input-modal.component.scss'],
  standalone: true,
  imports: [IonButton, IonInput, FormsModule],
})
export class LabelInputModalComponent {
  labelValue: string = '';

  constructor(private modalCtrl: ModalController) {}

  confirm() {
    console.log(this.labelValue);
    if (this.labelValue === '') {
      return this.close();
    }
    return this.modalCtrl.dismiss(this.labelValue, 'confirm');
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
