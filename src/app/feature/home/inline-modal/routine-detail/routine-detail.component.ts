import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
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
} from '@ionic/angular/standalone';
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
    IonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutineDetailComponent implements OnInit {
  @Input() colors: ColorPaletteItem[] = [];
  @Input() currentItem!: DayItem;

  itemLabel: string = '';
  items: DayItem[] = [];
  colorPalette: ColorPaletteItem[] = [];
  pickerColor: string = '#1A65EB';

  inputModel = '';

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  constructor(
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.inputModel = this.currentItem.label;
    // this.colorPalette = this.colors;
    this.loadPaletteFromStorage();
  }

  // async openColorPicker() {
  //   const modal = await this.modalCtrl.create({
  //     component: NewColorPickerComponent,
  //     componentProps: {
  //       color: this.pickerColor,
  //     },
  //     initialBreakpoint: 0.65,
  //     breakpoints: [0.65],
  //     handle: false
  //   });

  //   await modal.present();

  //   const { data, role } = await modal.onWillDismiss();

  //   if (role === 'confirm' && data) {
  //     this.addColorToPalette(data);
  //     this.pickerColor = data;
  //   }
  // }

    async openColorPicker() {
    const modal = await this.modalCtrl.create({
      component: NewColorPickerComponent,
      componentProps: { color: this.pickerColor },
      initialBreakpoint: 0.65,
      breakpoints: [0.65],
      handle: false,
      backdropDismiss: true,
      cssClass: 'color-picker-modal'
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.addColorToPalette(data);
      this.pickerColor = data;
    }
  }

  addColorToPalette(hexColor: string) {
    const colorExists = this.colorPalette.some(
      (item) => item.color === hexColor
    );

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

      this.savePaletteToStorage();
    }
  }

  selectNewColorForRoutine(newColor: string) {
    if (this.currentItem) {
      this.currentItem.color = newColor;
    }
  }

  onInput(event: CustomEvent) {
    const value = (event.target as HTMLIonInputElement).value ?? '';

    const filteredValue = (value as string).replace(/[^a-zA-Z0-9]+/g, '');

    this.ionInputEl.value = this.inputModel = filteredValue;

    this.itemLabel = this.ionInputEl.value;
  }

  saveAndClose() {
    this.currentItem.label = this.itemLabel;
    this.modalCtrl.dismiss();
  }

  addItem(label: string) {
    // Per coerenza, applico l'immutabilità anche qui
    this.items = [
      ...this.items,
      { id: Date.now(), label: label, color: '#8a8a8aff' },
    ];
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

    this.savePaletteToStorage();
  }

  private savePaletteToStorage() {
    // localStorage può salvare solo stringhe, quindi convertiamo l'array in JSON
    localStorage.setItem('userColorPalette', JSON.stringify(this.colorPalette));
  }

  private loadPaletteFromStorage() {
    const savedPalette = localStorage.getItem('userColorPalette');
    if (savedPalette) {
      // Se troviamo una palette salvata, la carichiamo
      this.colorPalette = JSON.parse(savedPalette);
    } else {
      // Altrimenti, puoi inizializzare con colori di default
      this.colorPalette = this.colors; // o un array vuoto []
    }
  }
}
