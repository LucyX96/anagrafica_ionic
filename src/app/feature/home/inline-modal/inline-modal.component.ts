import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  Gesture,
  GestureController,
  IonReorderGroup,
  IonReorder,
  ReorderEndCustomEvent,
  IonModal,
  IonFabList,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, clipboardSharp } from 'ionicons/icons';
import { RoutineDetailComponent } from './routine-detail/routine-detail.component';
import { AddItemModalComponent } from './routine-detail/add-item-modal/add-item-modal.component';

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
  selector: 'app-inline-modal',
  templateUrl: './inline-modal.component.html',
  styleUrls: ['./inline-modal.component.scss'],
  imports: [
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonReorderGroup,
    IonReorder,
    MatIcon,
    IonModal,
    RoutineDetailComponent,
    IonFabList,
  ],
})
export class InlineModalComponent implements OnInit, AfterViewInit {
  @ViewChild('header', { read: ElementRef }) headerEl!: ElementRef;
  @Output() draggedDown = new EventEmitter<void>();
  @Output() dragProgress = new EventEmitter<number>();

  items: DayItem[] = [];
  colorPalette: ColorPaletteItem[] = [
    {
      id: 1,
      color: '#f94747ff'
    }
  ];

  private gesture!: Gesture;
  private initialStep: number = 0;
  private isDragging = false;

  constructor(
    private gestureCtrl: GestureController,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private modalCtrl: ModalController
  ) {
    addIcons({ add, clipboardSharp });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.createGesture();
  }

  async openAddItemModal() {
    if (this.colorPalette!=null) {

    }
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

  private createGesture() {
    const closeThreshold = this.elRef.nativeElement.offsetHeight * 0.5;

    this.gesture = this.gestureCtrl.create({
      el: this.headerEl.nativeElement,
      gestureName: 'panel-drag',
      direction: 'y',
      threshold: 0,
      onStart: () => {
        this.renderer.setStyle(this.elRef.nativeElement, 'transition', 'none');
        this.isDragging = true;
      },
      onMove: (ev) => {
        const newY = this.initialStep + ev.deltaY;

        if (newY >= 0) {
          this.renderer.setStyle(
            this.elRef.nativeElement,
            'transform',
            `translateY(${newY}px)`
          );

          const progress = Math.min(1, newY / closeThreshold);
          this.dragProgress.emit(progress);
        }
      },
      onEnd: (ev) => {
        this.renderer.setStyle(
          this.elRef.nativeElement,
          'transition',
          'transform 0.3s ease-out'
        );
        this.isDragging = false;

        if (ev.deltaY > closeThreshold) {
          this.dragProgress.emit(1);
          this.renderer.setStyle(
            this.elRef.nativeElement,
            'transform',
            'translateY(100%)'
          );
          this.draggedDown.emit();
        } else {
          this.dragProgress.emit(0);
          this.renderer.setStyle(
            this.elRef.nativeElement,
            'transform',
            'translateY(0px)'
          );
        }
      },
    });

    this.gesture.enable();
  }

  ngOnDestroy() {
    if (this.gesture) {
      this.gesture.destroy();
    }
  }

  handleReorderEnd(event: ReorderEndCustomEvent) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    event.detail.complete();
  }

  public resetPosition() {
    this.renderer.setStyle(this.elRef.nativeElement, 'transform', '');
  }

  private addItem(label: string, hexColor: any) {
    const newId = Date.now();
    this.items.push({
      id: newId,
      label: label,
      color: hexColor,
    });
  }

  updateItem(updatedItem: DayItem) {
    const index = this.items.findIndex(item => item.id === updatedItem.id);

    if (index !== -1) {
      this.items[index] = updatedItem;
    }
  }
}
