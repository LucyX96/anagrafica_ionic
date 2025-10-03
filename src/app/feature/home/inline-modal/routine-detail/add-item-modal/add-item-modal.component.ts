import { Component, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonLabel, IonList, IonRow, IonCol, IonFabButton } from '@ionic/angular/standalone';
import { ColorPaletteItem } from 'src/app/core/model/color-interface';

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
  

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.availableColors.length > 0) {
      this.selectedColor = this.availableColors[0].color;
    }
    this.label = 'Day 1';
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