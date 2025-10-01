import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonLabel, IonList, IonRow, IonCol, IonFabButton } from '@ionic/angular/standalone';
import { ColorPaletteItem } from '../routine-detail.component';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonContent, 
    IonInput, 
    IonLabel, 
    IonRow, 
    IonCol
  ],
})
export class AddItemModalComponent {
  @Input() availableColors: ColorPaletteItem[] = [];

  label: string = '';
  selectedColor: string | null = null;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.availableColors.length > 0) {
      this.selectedColor = this.availableColors[0].color;
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.label && this.selectedColor) {
      const data = { label: this.label, color: this.selectedColor };
      return this.modalCtrl.dismiss(data, 'confirm');
    }
    return;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }
}