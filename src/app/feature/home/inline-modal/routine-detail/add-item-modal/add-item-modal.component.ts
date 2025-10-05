import { Component, Input, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonLabel,
  IonRow,
  IonCol,
  IonGrid,
  IonText,
  IonIcon,
  IonHeader,
  IonToast,
} from '@ionic/angular/standalone';
import { ColorPaletteItem } from 'src/app/core/model/color-interface';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonInput,
    IonLabel,
    IonRow,
    IonCol,
    IonGrid,
    IonIcon,
    IonText,
    IonHeader
],
})
export class AddItemModalComponent {
  @Input() availableColors: ColorPaletteItem[] = [];

  label: string = '';
  selectedColor: string | null = null;

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  constructor(private modalCtrl: ModalController, private toastController: ToastController) {}

  ngOnInit() {
    if (this.availableColors.length > 0) {
      this.selectedColor = this.availableColors[0].color;
    }
  }

  onInput(event: CustomEvent) {
    const value = (event.target as HTMLIonInputElement).value ?? '';
    const filteredValue = (value as string).replace(/[^a-zA-Z0-9]+/g, '');
    this.ionInputEl.value = this.label = filteredValue;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log('click conferma');
    if (this.label === '') {
      this.openToast();
      return;
    }

    if (this.label && this.selectedColor) {
        const data = { label: this.label, color: this.selectedColor };
        return this.modalCtrl.dismiss(data, 'confirm');
      }
      return;
  }

  async openToast() {
    const toast = await this.toastController.create({
      header: 'Error type in Name',
      duration: 3000,
    });
    await toast.present();
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }
}
