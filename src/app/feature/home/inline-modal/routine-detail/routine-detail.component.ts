import {
  Component,
  Input,
  OnInit,
  OnChanges, 
  SimpleChanges, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy, 
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
import { PaletteService} from 'src/app/core/services/color-palette.service';
import { ColorPaletteItem, DayItem } from 'src/app/core/model/color-interface';

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
export class RoutineDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() colors: ColorPaletteItem[] = [];
  @Input() currentItem!: DayItem;

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;
  inputModel = '';
  itemLabel: string = '';
  items: DayItem[] = []; 
  pickerColor: string = '#1A65EB';

  constructor(
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private paletteService: PaletteService
  ) {}

  ngOnInit() {
    this.inputModel = this.currentItem.label;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Questo blocco di codice verrà eseguito ogni volta che il componente genitore
    // passa un nuovo array di colori a questo componente.
    if (changes['colors']) {
      console.log('➡️ [RoutineDetailComponent] Dati ricevuti via @Input [colors]:', this.colors);
    }
  }

  // addNewColor() {
  //   this.paletteService.addNewColor('#000000ff');
  // }

  async openColorPicker() {
    console.log('🎨 [RoutineDetailComponent] Apro il Color Picker.');
    const availableColors = this.paletteService.getCurrentPalette();

    const modal = await this.modalCtrl.create({
      component: NewColorPickerComponent,
      componentProps: { availableColors: availableColors },
      initialBreakpoint: 0.65,
      breakpoints: [0.65],
      handle: false,
      backdropDismiss: true,
      cssClass: 'color-picker-modal',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      console.log(`📦 [RoutineDetailComponent] Color Picker ha restituito il colore: ${data}`);
      this.addColorToPalette(data);
      this.pickerColor = data;
    }
  }

  addColorToPalette(hexColor: string) {
    const currentPalette = this.paletteService.getCurrentPalette();
    const colorExists = currentPalette.some((item) => item.color === hexColor);

    if (hexColor && !colorExists) {
      this.paletteService.addNewColor(hexColor);
    }
  }

  removeColorFromPalette(idToRemove: number) {
    if (this.colors.length > 1) {
      this.paletteService.removeColor(idToRemove);
    } 
  }

  selectNewColorForRoutine(newColor: string) {
    if (this.currentItem) {
      this.currentItem.color = newColor;
    }
  }

  onInput(event: CustomEvent) {
    const value = (event.target as HTMLIonInputElement).value ?? '';
    const filteredValue = (value as string).replace(/[^a-zA-Z0-9 ]+/g, '');
    this.ionInputEl.value = this.inputModel = filteredValue;
    this.itemLabel = this.ionInputEl.value;
  }

  saveAndClose() {
    this.currentItem.label = this.itemLabel;
    this.modalCtrl.dismiss(this.currentItem, 'confirm');
  }

  addItem(label: string) {
    this.items = [...this.items, { id: Date.now(), label: label, color: '#8a8a8aff' }];
    this.cdr.markForCheck();
  }

  removeItem(idToRemove: number) {
    this.items = this.items.filter((item) => item.id !== idToRemove);
    this.cdr.markForCheck();
  }
  
  ngOnDestroy() {
    console.log('❌ [RoutineDetailComponent] Componente distrutto.');
  }
}