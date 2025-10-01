import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { AddItemModalComponent } from './add-item-modal/add-item-modal.component';
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
    NewColorPickerComponent,
  ],
})
export class RoutineDetailComponent implements OnInit {
  @Input() colors: ColorPaletteItem[] = [];
  @Input() currentItem!: DayItem;
  @Output() itemUpdated = new EventEmitter<DayItem>();

  items: DayItem[] = [];
  colorPalette: ColorPaletteItem[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.colorPalette = this.colors
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  async openAddItemModal() {
    const modal = await this.modalCtrl.create({
      component: AddItemModalComponent,
      componentProps: {
        availableColors: this.colorPalette,
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.addItem(data.label);
    }
  }

  addItem(label: string) {
    const newId = Date.now();
    this.items.push({
      id: newId,
      label: label,
      color: '#8a8a8aff',
    });
  }

  removeItem(idToRemove: number) {
    this.items = this.items.filter((item) => item.id !== idToRemove);
  }

  addColorToPalette(hexColor: string) {
    console.log('Colore ricevuto dal figlio:', hexColor);

    const colorExists = this.colorPalette.some(
      (item) => item.color === hexColor
    );

    if (hexColor && !colorExists) {
      const newId = Date.now();

      const newColorItem: ColorPaletteItem = {
        id: newId,
        color: hexColor,
      };

      this.colorPalette.push(newColorItem);
    }
  }

  selectNewColorForRoutine(newColor: string) {
    if (this.currentItem) {
      this.currentItem.color = newColor;
      console.log('Nuovo colore selezionato per l\'item:', this.currentItem);
    }
  }

  saveAndClose() {
    this.itemUpdated.emit(this.currentItem);
    this.modalCtrl.dismiss();
  }

  removeColorFromPalette(idToRemove: number) {
    if (this.colorPalette.length > 1) {
      this.colorPalette = this.colorPalette.filter((c) => c.id !== idToRemove);
    }
  }
}
