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
import { Observable, Subscription } from 'rxjs';
import { PaletteService } from 'src/app/core/services/color-palette.service';
import { AsyncPipe } from '@angular/common';
import { ColorPaletteItem, DayItem } from 'src/app/core/model/color-interface';

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
    AsyncPipe,
  ],
})
export class InlineModalComponent implements OnInit, AfterViewInit {
  @ViewChild('header', { read: ElementRef }) headerEl!: ElementRef;
  @Output() draggedDown = new EventEmitter<void>();
  @Output() dragProgress = new EventEmitter<number>();

  items: DayItem[] = [];

  private gesture!: Gesture;
  private initialStep: number = 0;
  private isDragging = false;

  public palette$!: Observable<ColorPaletteItem[]>;
  private paletteSubscription!: Subscription;

  constructor(
    private gestureCtrl: GestureController,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private modalCtrl: ModalController,
    private paletteService: PaletteService
  ) {
    addIcons({ add, clipboardSharp });
  }

  ngOnInit() {
    this.palette$ = this.paletteService.palette$;
    this.paletteSubscription = this.palette$.subscribe((palette) => {
      console.log(
        "📥 [InlineModalComponent] Ricevuta nuova palette dall'Observable:",
        palette
      );
    });
  }

  ngAfterViewInit() {
    this.createGesture();
  }

  addNewColor() {
    this.paletteService.addNewColor('#000000ff');
  }

  async openAddItemModal() {
    const availableColors = this.paletteService.getCurrentPalette();

    const modal = await this.modalCtrl.create({
      component: AddItemModalComponent,
      componentProps: { availableColors: availableColors },
      initialBreakpoint: 0.65,
      breakpoints: [0.65],
      handle: false,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
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
    // NOTA: È fondamentale fare l'unsubscribe per evitare perdite di memoria.
    if (this.paletteSubscription) {
      this.paletteSubscription.unsubscribe();
    }
  }

  handleReorderEnd(event: ReorderEndCustomEvent) {
    event.detail.complete();
  }

  public resetPosition() {
    this.renderer.setStyle(this.elRef.nativeElement, 'transform', '');
  }

  private addItem(label: string, hexColor: any) {
    const newId = Date.now();
    const newItem = {
      id: newId,
      label: label,
      color: hexColor,
    };

    this.items.push(newItem);
  }
}
