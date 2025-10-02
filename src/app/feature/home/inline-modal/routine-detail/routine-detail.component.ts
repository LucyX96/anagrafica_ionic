import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  // Aggiungo esplicitamente la strategia per chiarezza
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutineDetailComponent implements OnInit {
  @Input() colors: ColorPaletteItem[] = [];
  @Input() currentItem!: DayItem;
  @Output() itemUpdated = new EventEmitter<DayItem>();

  items: DayItem[] = [];
  colorPalette: ColorPaletteItem[] = [];
  
  private pickerColor: string = '#1A65EB';

  // MODIFICA 1: Iniezione del ChangeDetectorRef per il controllo manuale
  constructor(
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.colorPalette = this.colors;
    console.log('Componente inizializzato. Palette iniziale:', this.colorPalette);
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
      this.pickerColor = data;
    }
  }

  addColorToPalette(hexColor: string) {

    const colorExists = this.colorPalette.some(item => item.color === hexColor);

    if (hexColor && !colorExists) {
      const newColorItem: ColorPaletteItem = {
        id: Date.now(),
        color: hexColor,
      };

      // La logica di immutabilità è corretta
      this.colorPalette = [...this.colorPalette, newColorItem];
      

      // MODIFICA 2: Diciamo ad Angular di aggiornare la vista
      // Questa è la riga che dovrebbe risolvere il problema definitivamente.
      this.cdr.markForCheck();

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
    // Per coerenza, applico l'immutabilità anche qui
    this.items = [...this.items, { id: Date.now(), label: label, color: '#8a8a8aff' }];
    this.cdr.markForCheck();
  }

  removeItem(idToRemove: number) {
    this.items = this.items.filter((item) => item.id !== idToRemove);
    this.cdr.markForCheck();
  }

  removeColorFromPalette(idToRemove: number) {
    if (this.colorPalette.length > 1) {
      this.colorPalette = this.colorPalette.filter((c) => c.id !== idToRemove);
      this.cdr.markForCheck();
    }
  }
}

