import { Component, OnInit } from '@angular/core';
import {
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonContent,
  IonFabButton,
  IonInput,
  IonLabel,
  ModalController,
  IonPopover,
} from '@ionic/angular/standalone';
import { MaterialModule } from 'src/app/material.module';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { AddItemModalComponent } from './add-item-modal/add-item-modal.component';

export interface DayItem {
  id: number;
  label: string;
  color: string;
}

export interface ColorPaletteItem {
  id: number;
  color: string;
}

@Component({
  selector: 'app-routine-detail',
  templateUrl: './routine-detail.component.html',
  styleUrls: ['./routine-detail.component.scss'],
  imports: [
    MaterialModule,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonText,
    IonContent,
    IonFabButton,
    IonInput,
    IonLabel,
    IonPopover,
    ColorPickerComponent,
  ],
})
export class RoutineDetailComponent implements OnInit {
  items: DayItem[] = [];

  colorPalette: ColorPaletteItem[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {}

  async openAddItemModal() {
    const modal = await this.modalCtrl.create({
      component: AddItemModalComponent,
      componentProps: {
        // Passiamo la nostra tavolozza di colori al modale
        availableColors: this.colorPalette,
      },
    });

    await modal.present();

    // Aspetta i dati che il modale restituirà alla chiusura
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // Se l'utente ha confermato, crea la nuova etichetta con i dati ricevuti
      this.addItem(data.label, data.color);
    }
  }

  // Aggiunge un nuovo item alla lista principale
  private addItem(label: string, hexColor: string) {
    const newId = Date.now();
    this.items.push({
      id: newId,
      label: label,
      color: hexColor,
    });
  }

  // Rimuove un item dalla lista principale
  removeItem(idToRemove: number) {
    this.items = this.items.filter(item => item.id !== idToRemove);
  }

  // Aggiunge un nuovo colore alla TAVOLOZZA
  addColorToPalette(hexColor: string) {
    if (!this.colorPalette.some((c) => c.color === hexColor)) {
      const newId = Date.now();
      this.colorPalette.push({ id: newId, color: hexColor });
    }
  }

  // Rimuove un colore dalla TAVOLOZZA
  removeColorFromPalette(idToRemove: number) {
    // Impedisce di rimuovere l'ultimo colore
    if (this.colorPalette.length > 1) {
      this.colorPalette = this.colorPalette.filter((c) => c.id !== idToRemove);
    }
  }
}
