import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon, IonGrid, IonRow, IonCol, IonText, IonContent, IonFabButton, IonInput, IonLabel, ModalController, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { MaterialModule } from 'src/app/material.module';
import { NewColorPickerComponent } from './new-color-picker/new-color-picker.component';

export interface DayItem {
  id: number;
  label: string;
  color: any;
}

export interface ColorPaletteItem {
  id: number;
  color: any;
}

@Component({
  selector: 'app-routine-detail',
  templateUrl: './routine-detail.component.html',
  styleUrls: ['./routine-detail.component.scss'],
  standalone: true,
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
    IonLabel
],
})
export class RoutineDetailComponent implements OnInit {
  @Input() colors: ColorPaletteItem[] = [];
  @Input() currentItem!: DayItem;
  @Output() itemUpdated = new EventEmitter<DayItem>();

  items: DayItem[] = [];
  colorPalette: ColorPaletteItem[] = [];
  
  private pickerColor: string = '#1A65EB';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.colorPalette = this.colors;
  }

  async openColorPicker() {
    const modal = await this.modalCtrl.create({
      component: NewColorPickerComponent,
      componentProps: {
        color: this.pickerColor 
      },
      initialBreakpoint: 0.65,
      breakpoints: [0, 0.65]
    });
    
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      this.addColorToPalette(data);
      this.pickerColor = data; // Aggiorna il colore per la prossima apertura
    }
  }

  /**
   * Aggiunge un nuovo colore alla palette creando un nuovo array (immutabilità).
   * @param hexColor - Il colore in formato esadecimale da aggiungere.
   */
  addColorToPalette(hexColor: string) {
    const colorExists = this.colorPalette.some(item => item.color === hexColor);

    if (hexColor && !colorExists) {
      const newColorItem: ColorPaletteItem = {
        id: Date.now(),
        color: hexColor,
      };

      // Invece di this.colorPalette.push(newColorItem);
      // Creo un nuovo array con il vecchio contenuto più il nuovo elemento.
      this.colorPalette = [...this.colorPalette, newColorItem];
    }
  }

  selectNewColorForRoutine(newColor: string) {
    if (this.currentItem) {
      this.currentItem.color = newColor;
    }
  }

  saveAndClose() {
    this.itemUpdated.emit(this.currentItem);
    this.modalCtrl.dismiss();
  }
  
  addItem(label: string) {
    this.items.push({ id: Date.now(), label: label, color: '#8a8a8aff' });
  }

  removeItem(idToRemove: number) {
    this.items = this.items.filter((item) => item.id !== idToRemove);
  }

  removeColorFromPalette(idToRemove: number) {
    if (this.colorPalette.length > 1) {
      // Anche qui, uso un approccio immutabile per la rimozione
      this.colorPalette = this.colorPalette.filter((c) => c.id !== idToRemove);
    }
  }
}