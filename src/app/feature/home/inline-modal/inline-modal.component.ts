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
import { IonContent, IonFab, IonFabButton, IonList, IonItem, IonAvatar, IonLabel, InfiniteScrollCustomEvent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, Gesture, GestureController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

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
    IonInfiniteScroll,
    IonInfiniteScrollContent
],
})
export class InlineModalComponent implements OnInit, AfterViewInit {
  @ViewChild('header', { read: ElementRef }) headerEl!: ElementRef;
  @Output() draggedDown = new EventEmitter<void>();
  @Output() dragProgress = new EventEmitter<number>();

  items: string[] = [];

  private gesture!: Gesture;
  private initialStep: number = 0;
  private isDragging = false;

  constructor(
    private gestureCtrl: GestureController,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    addIcons({ add });
  }

  ngOnInit() {
    this.generateItems();
  }

  ngAfterViewInit() {
    this.createGesture();
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
        this.renderer.setStyle(this.elRef.nativeElement, 'transform', `translateY(${newY}px)`);

        const progress = Math.min(1, newY / closeThreshold);
        this.dragProgress.emit(progress);
      }
    },
      onEnd: (ev) => {
      this.renderer.setStyle(this.elRef.nativeElement, 'transition', 'transform 0.3s ease-out');
      this.isDragging = false;
      
      if (ev.deltaY > closeThreshold) {
        this.dragProgress.emit(1); 
        this.renderer.setStyle(this.elRef.nativeElement, 'transform', 'translateY(100%)');
        this.draggedDown.emit();
      } else {
        this.dragProgress.emit(0); 
        this.renderer.setStyle(this.elRef.nativeElement, 'transform', 'translateY(0px)');
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

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

   public resetPosition() {
    // Rimuove lo stile 'transform' in linea, permettendo alle classi CSS di comandare
    this.renderer.setStyle(this.elRef.nativeElement, 'transform', '');
  }
}
