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
import { PaletteService } from 'src/app/core/services/color-palette.service';
import { ColorPaletteItem, DayItem, Exercise } from 'src/app/core/model/color-interface';
import { ToastController } from '@ionic/angular';
import { LabelInputModalComponent } from './label-input-modal/label-input-modal.component';
import { RoutineService } from 'src/app/core/services/routine.service';

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
  @ViewChild('routinesItem', { static: false }) routinesItem?: IonCol;

  inputModel = '';
  itemLabel: string = '';
  labelColor: string = '#5b636fff';
  labelInput: string = '';

  pickerColor: string = '#1A65EB';

  constructor(
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private paletteService: PaletteService,
    private toastController: ToastController,
    private routineService: RoutineService
  ) {}

  ngOnInit() {
    this.itemLabel = this.currentItem.label;
    this.inputModel = this.itemLabel;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Questo blocco di codice verrà eseguito ogni volta che il componente genitore
    // passa un nuovo array di colori a questo componente.
    if (changes['colors']) {
      console.log(
        '➡️ [RoutineDetailComponent] Dati ricevuti via @Input [colors]:',
        this.colors
      );
    }
  }

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
      console.log(
        `📦 [RoutineDetailComponent] Color Picker ha restituito il colore: ${data}`
      );
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
    if (this.itemLabel === '') {
      this.openToast();
      return;
    }
    this.currentItem.label = this.itemLabel;
    return this.modalCtrl.dismiss(this.currentItem, 'confirm');
  }

  async openToast() {
    const toast = await this.toastController.create({
      header: 'Error type in Name',
      duration: 3000,
    });

    await toast.present();
  }

  async addItem() {
    await this.openLabelModal();

    if (this.labelInput != '') {
      console.log(this.currentItem)
      this.currentItem.exercise = [
        ...this.currentItem.exercise,
        { id: Date.now(), label: this.labelInput, color: this.labelColor },
      ];

      
      this.cdr.markForCheck();
    }
  }

  async openLabelModal() {
    const modal = await this.modalCtrl.create({
      component: LabelInputModalComponent,
      componentProps: {},
      cssClass: 'custom-modal',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.labelInput = data;
      return this.modalCtrl.dismiss(data, 'confirm');
    }
    return this.openToast();
  }

  removeItem(event: Event, idToRemove: number) {
    const col = event.currentTarget as HTMLElement;
    const id = col.id;
    if (id === 'routinesItem') {
      this.routineService.removeRoutine(idToRemove);
      this.modalCtrl.dismiss(idToRemove, 'confirm');
    } else {
      this.currentItem.exercise = this.currentItem.exercise.filter((item) => item.id !== idToRemove);
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    console.log('❌ [RoutineDetailComponent] Componente distrutto.');
  }
}
