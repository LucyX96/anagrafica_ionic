import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { IonContent, IonFab, IonFabButton, IonList, IonItem, IonAvatar, IonLabel, InfiniteScrollCustomEvent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
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
export class InlineModalComponent implements OnInit {
  items: string[] = [];
  @Output() draggedDown = new EventEmitter<void>();

  // NUOVO: Emettiamo il progresso del drag (da 0.0 a 1.0)
  @Output() dragProgress = new EventEmitter<number>();

  private startY = 0;
  private currentY = 0;
  private dragging = false;
  private closeThreshold = 0; // Per ottimizzazione, la calcoliamo una volta sola

  constructor(private elRef: ElementRef) {
    addIcons({ add });
  }

  ngOnInit() {
    this.generateItems();
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

  startDrag(event: MouseEvent | TouchEvent) {
    this.dragging = true;
    this.startY = this.getY(event);
    document.body.style.overflow = 'hidden';

    // Calcoliamo la soglia qui, all'inizio del trascinamento
    this.closeThreshold = this.elRef.nativeElement.offsetHeight * 0.25;

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('touchmove', this.onDrag, { passive: false });
    document.addEventListener('touchend', this.endDrag);
  }

  onDrag = (event: MouseEvent | TouchEvent) => {
    if (!this.dragging) return;
    event.preventDefault();
    this.currentY = this.getY(event) - this.startY;

    if (this.currentY >= 0) {
      this.elRef.nativeElement.style.transform = `translateY(${this.currentY}px)`;

      // NUOVO: Calcoliamo e emettiamo il progresso in tempo reale
      const progress = Math.min(1, this.currentY / this.closeThreshold);
      this.dragProgress.emit(progress);
    }
  };

  endDrag = () => {
    document.body.style.overflow = ''; // Riabilita lo scroll
    if (this.currentY > this.closeThreshold) {
      this.dragProgress.emit(1); // Stato finale: 100% (chiuso)
      this.draggedDown.emit();
    } else {
      this.dragProgress.emit(0); // Stato finale: 0% (aperto/resettato)
      this.elRef.nativeElement.style.transform = '';
    }

    this.dragging = false;
    this.currentY = 0;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.endDrag);
  };

  private getY(event: MouseEvent | TouchEvent): number {
    if (event instanceof TouchEvent) return event.touches[0].clientY;
    return event.clientY;
  }
}
