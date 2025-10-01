import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  HostBinding,
} from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular/standalone';

@Directive({
  selector: '[appDraggablePanel]',
  standalone: true,
  host: {
    style: 'cursor: grab;',
  },
})
export class DraggablePanelDirective implements AfterViewInit, OnDestroy {
  @Output() draggedDown = new EventEmitter<void>();
  @Output() dragProgress = new EventEmitter<number>();

  @HostBinding('class.is-dragging')
  private isDragging = false;

  private gesture!: Gesture;
  private hostElement!: HTMLElement;

  constructor(
    private gestureCtrl: GestureController,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    console.log('Draggable Panel Directive ATTIVA'); 
    this.hostElement = this.elRef.nativeElement.closest('app-inline-modal');
    console.log('Elemento target da muovere:', this.hostElement);
  }

  ngAfterViewInit() {
    this.createGesture();
  }

  ngOnDestroy() {
    if (this.gesture) {
      this.gesture.destroy();
    }
  }

  public resetPosition() {
    this.renderer.setStyle(
      this.hostElement,
      'transition',
      'transform 0.3s ease-out'
    );
    this.renderer.setStyle(this.hostElement, 'transform', 'translateY(0px)');
  }

  private createGesture() {
    if (!this.hostElement) {
      console.error(
        'DraggablePanelDirective: Impossibile trovare l\'elemento host "app-inline-modal".'
      );
      return;
    }

    const closeThreshold = this.hostElement.offsetHeight * 0.5;

    this.gesture = this.gestureCtrl.create({
      el: this.elRef.nativeElement,
      gestureName: 'panel-drag',
      direction: 'y',
      threshold: 0,
      priority: 100,
      onStart: () => {
        this.isDragging = true;
        this.renderer.setStyle(this.hostElement, 'transition', 'none');
      },
      onMove: (ev) => {
        const newY = ev.deltaY;
        if (newY >= 0) {
          this.renderer.setStyle(
            this.hostElement,
            'transform',
            `translateY(${newY}px)`
          );
          const progress = Math.min(1, newY / closeThreshold);
          this.dragProgress.emit(progress);
        }
      },
      onEnd: (ev) => {
        this.isDragging = false;
        this.renderer.setStyle(
          this.hostElement,
          'transition',
          'transform 0.3s ease-out'
        );

        if (ev.deltaY > closeThreshold) {
          this.dragProgress.emit(1);
          this.renderer.setStyle(
            this.hostElement,
            'transform',
            'translateY(100%)'
          );
          this.draggedDown.emit();
        } else {
          this.dragProgress.emit(0);
          this.resetPosition();
        }
      },
    });

    this.gesture.enable();
  }
}
