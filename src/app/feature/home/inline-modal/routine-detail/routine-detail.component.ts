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
import { ColorPaletteItem } from 'src/app/core/model/color-interface';
import { ToastController } from '@ionic/angular';
import { LabelInputModalComponent } from './label-input-modal/label-input-modal.component';
import { RoutineService } from 'src/app/core/services/routine.service';
import { LongPressDirective } from 'src/app/core/directive/long-press.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DayItem } from 'src/app/core/model/day-item-exercise-interface';

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
    LongPressDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  selectedLabel: string | null = null;
  selectedButtonId: number | null = null;

  pickerColor: string = '#1A65EB';
  selectedColorId: number | null = null

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

    this.selectedButtonId = this.currentItem.selectedExerciseId ?? null;
    this.selectedLabel = this.currentItem.colorLabel ?? null;

    const initialColor = this.colors.find(c => c.color === this.currentItem.color);
    if (initialColor) {
      this.selectedColorId = initialColor.id;
    }
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

    this.colors = this.paletteService.getCurrentPalette();
    this.cdr.markForCheck();
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

  selectNewColorForRoutine(colorItem: ColorPaletteItem) {
    this.selectedColorId = colorItem.id;
    if (this.currentItem) {
      this.currentItem.color = colorItem.color;
    }
    this.cdr.markForCheck();
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

    if (this.selectedLabel !== null) {
      this.currentItem.colorLabel = this.selectedLabel;
      this.currentItem.selectedExerciseId = this.selectedButtonId;
    }

    this.routineService.updateRoutine(this.currentItem);

    return this.modalCtrl.dismiss(this.currentItem, 'confirm');
  }

  async openToast() {
    const toast = await this.toastController.create({
      header: 'Error type in Name',
      duration: 3000,
    });

    await toast.present();
  }

  async addItem(itemId: number) {
    this.openDynamicModal(
      {
        title: 'Aggiungi esercizio',
        showInput: true,
        inputLabel: 'Nome esercizio',
        inputMaxLength: 3,
        action: 'add',
      },
      itemId
    );

    if (this.labelInput != '') {
      console.log(this.currentItem);
      this.currentItem.exercise = [
        ...this.currentItem.exercise,
        { id: Date.now(), label: this.labelInput, color: this.labelColor },
      ];

      this.cdr.markForCheck();
    }
  }

  async openDynamicModal(
    config: {
      title: string;
      message?: string;
      showInput?: boolean;
      inputLabel?: string;
      inputMaxLength?: number;
      action: 'add' | 'delete' | 'edit';
      targetId?: number; // utile per delete/edit
    },
    id: number
  ) {
    const modal = await this.modalCtrl.create({
      component: LabelInputModalComponent,
      componentProps: config,
      cssClass: 'custom-modal',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role !== 'confirm') return this.openToast();

    switch (config.action) {
      // Aggiungi nuovo esercizio
      case 'add':
        if (data && data.trim() !== '') {
          this.labelInput = data.trim();
          this.currentItem.exercise = [
            ...this.currentItem.exercise,
            { id: Date.now(), label: this.labelInput, color: this.labelColor },
          ];
          this.cdr.markForCheck();
        } else {
          await this.openToast();
        }
        break;

      // Elimina esercizio o routine
      case 'delete':
        if (config.targetId) {
          this.currentItem.exercise = this.currentItem.exercise.filter(
            (item) => item.id !== id
          );

          this.routineService.updateRoutine(this.currentItem);

          this.cdr.markForCheck();
        } else {
          this.routineService.removeRoutine(this.currentItem.id);
        }
        break;
    }

    return this.modalCtrl.dismiss(data, 'confirm');
  }

  selectItem(label: string, id: number) {
    this.selectedButtonId = id;
    this.selectedLabel = label;
    console.log('Selezionato:', label, 'ID:', id);
  }

  async removeItem(event: Event, idToRemove: number) {
    const col = event.currentTarget as HTMLElement;
    const id = col?.id || null;

    // Se è una routine intera
    if (id === 'routinesItem') {
      await this.openDynamicModal(
        {
          title: 'Conferma eliminazione',
          message: 'Vuoi davvero eliminare questa routine?',
          showInput: false,
          action: 'delete',
          targetId: undefined, // così nel dynamic modal entra nel ramo removeRoutine
        },
        idToRemove
      );
    }
    // Se è un etichetta all’interno della routine
    else {
      await this.openDynamicModal(
        {
          title: 'Conferma eliminazione',
          message: 'Vuoi davvero eliminare questa etichetta?',
          showInput: false,
          action: 'delete',
          targetId: idToRemove,
        },
        idToRemove
      );
    }
  }

  ngOnDestroy() {}
}
