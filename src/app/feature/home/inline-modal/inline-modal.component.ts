import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IonContent, IonFab, IonFabButton, IonList, IonItem, IonAvatar, IonLabel, IonIcon, Gesture, GestureController, IonReorderGroup, IonReorder, ReorderEndCustomEvent, IonModal, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { RoutineDetailComponent } from "./routine-detail/routine-detail.component";

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
    RoutineDetailComponent
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
    private renderer: Renderer2,
  ) {
    addIcons({ add });
    
  }

  ngOnInit() {
    // this.generateItems();
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

  handleReorderEnd(event: ReorderEndCustomEvent) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    event.detail.complete();
  }

   public resetPosition() {
    this.renderer.setStyle(this.elRef.nativeElement, 'transform', '');
  }

  addItem() {
      this.items.push('Item');
  }
}
