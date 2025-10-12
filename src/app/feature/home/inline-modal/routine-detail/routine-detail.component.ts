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
import { PaletteService } from 'src/app/core/services/color-palette.service';
import { ColorPaletteItem } from 'src/app/core/model/color-interface';
import { PopoverController, ToastController } from '@ionic/angular';
import { LabelInputModalComponent } from './label-input-modal/label-input-modal.component';
import { RoutineService } from 'src/app/core/services/routine.service';
import { LongPressDirective } from 'src/app/core/directive/long-press.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DayItem } from 'src/app/core/model/day-item-exercise-interface';
import { RoutineOptionPopoverComponent } from './routine-option-popover/routine-option-popover.component';

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
export class RoutineDetailComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() availableColors: ColorPaletteItem[] = [];
  @Input() currentItem!: DayItem;

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  label: string = '';
  selectedColor: string | null = null;
  selectedColorId: number | null = null;
  selectedButtonId: number | null = null;
  selectedLabel: string | null = null;
  labelColor: string = '#5b636fff';
  labelInput: string = '';

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef,
    private routineService: RoutineService,
    private paletteService: PaletteService,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    if (this.mode === 'edit' && this.currentItem) {
      this.label = this.currentItem.label;
      this.selectedColor = this.currentItem.color;

      const initialColor = this.availableColors.find(
        (c) => c.color === this.currentItem.color
      );
      if (initialColor) this.selectedColorId = initialColor.id;

      this.selectedButtonId = this.currentItem.selectedExerciseId ?? null;
      this.selectedLabel = this.currentItem.colorLabel ?? null;
    } else if (this.mode === 'create' && this.availableColors.length > 0) {
      this.selectedColor = this.availableColors[0].color;
    }
  }

  // --- Input controllo testo
  onInput(event: CustomEvent) {
    const value = (event.target as HTMLIonInputElement).value ?? '';
    const filteredValue = (value as string).replace(/[^a-zA-Z0-9 ]+/g, '');
    this.ionInputEl.value = this.label = filteredValue;
  }

  // --- Selezione colore
  selectColor(color: string) {
    this.selectedColor = color;
  }

  // --- Apertura color picker
  async openColorPicker(color: string) {
    const colorItemIndex = this.availableColors.findIndex(
      (c) => c.color === color
    );
    if (colorItemIndex != this.availableColors.length - 1) {
      return;
    }
    const availableColors = this.paletteService.getCurrentPalette();

    const modal = await this.modalCtrl.create({
      component: NewColorPickerComponent,
      componentProps: { availableColors },
      initialBreakpoint: 0.65,
      breakpoints: [0.65],
      handle: false,
      backdropDismiss: true,
      cssClass: 'color-picker-modal',
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.addColorToPalette(data);
      this.selectedColor = data;
    }
    this.availableColors = this.paletteService.getCurrentPalette();
    this.cdr.markForCheck();
  }

  addColorToPalette(hexColor: string) {
    const currentPalette = this.paletteService.getCurrentPalette();
    const colorExists = currentPalette.some((c) => c.color === hexColor);
    if (hexColor && !colorExists) {
      this.paletteService.addNewColor(hexColor);
    }
  }

  // --- Gestione pulsanti di azione
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    if (this.label === '') {
      await this.openToast();
      return;
    }

    if (this.mode === 'create') {
      if (this.selectedColor) {
        const data = { label: this.label, color: this.selectedColor };
        return this.modalCtrl.dismiss(data, 'confirm');
      }
    }

    if (this.mode === 'edit' && this.currentItem) {
      this.currentItem.label = this.label;
      if (this.selectedColor) this.currentItem.color = this.selectedColor;
      if (this.selectedLabel) this.currentItem.colorLabel = this.selectedLabel;
      if (this.selectedButtonId)
        this.currentItem.selectedExerciseId = this.selectedButtonId;

      this.routineService.updateRoutine(this.currentItem);
      return this.modalCtrl.dismiss(this.currentItem, 'confirm');
    }

    return;
  }

  // --- Toast
  async openToast() {
    const toast = await this.toastController.create({
      header: 'Error type in Name',
      duration: 3000,
    });
    await toast.present();
  }

  // --- Metodi per edit mode
  selectItem(label: string, id: number) {
    this.selectedButtonId = id;
    this.selectedLabel = label;
  }

  async addItem(itemId: number) {
    const modal = await this.modalCtrl.create({
      component: LabelInputModalComponent,
      componentProps: {
        title: 'Aggiungi esercizio',
        showInput: true,
        inputLabel: 'Nome esercizio',
        inputMaxLength: 3,
        action: 'add',
      },
      cssClass: 'custom-modal',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data && this.currentItem) {
      this.currentItem.exercise = [
        ...this.currentItem.exercise,
        { id: Date.now(), label: data, color: this.labelColor },
      ];
      this.routineService.updateRoutine(this.currentItem);
      this.cdr.markForCheck();
    }
  }

  async removeItem(event: Event, idToRemove: number) {
    const col = event.currentTarget as HTMLElement;
    const id = col?.id || null;

    const modal = await this.modalCtrl.create({
      component: LabelInputModalComponent,
      componentProps: {
        title: 'Conferma eliminazione',
        message: 'Vuoi davvero eliminare questo elemento?',
        showInput: false,
        action: 'delete',
      },
      cssClass: 'custom-modal',
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();

    if (role !== 'confirm' || !this.currentItem) return;

    if (id === 'routinesItem') {
      this.routineService.removeRoutine(this.currentItem.id);
    } else {
      this.currentItem.exercise = this.currentItem.exercise.filter(
        (e) => e.id !== idToRemove
      );
      this.routineService.updateRoutine(this.currentItem);
      this.cdr.markForCheck();
    }
  }

  async openPopover(ev: Event, itemId: number) {
  const popover = await this.popoverCtrl.create({
    component: RoutineOptionPopoverComponent,
    event: ev,
    translucent: true,
    showBackdrop: true,
    dismissOnSelect: true,      // ✅ chiusura automatica alla selezione
    animated: true,
    mode: 'ios',                // ✅ stile iOS, più pulito graficamente
    cssClass: 'routine-popover',// ✅ classe personalizzabile via SCSS
    componentProps: { itemId },
  });

  await popover.present();

  const { data } = await popover.onDidDismiss();
  if (data?.action === 'delete') {
    this.removeItem(ev, itemId);
  }
}
}
