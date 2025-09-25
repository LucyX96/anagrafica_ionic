import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonDatetime,
  IonItem,
} from '@ionic/angular/standalone';
import { TitleEmitterDirective } from 'src/app/core/directive/title-emitter';
import { InlineModalComponent } from './inline-modal/inline-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonDatetime,
    InlineModalComponent,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
  ],
})
export class HomePage extends TitleEmitterDirective implements OnInit {

  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;
  @ViewChild('datetime', { read: ElementRef }) datetimeEl!: ElementRef;

  override title: string = 'Home';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.openAccordion();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  openAccordion() {
    this.accordionGroup.value = 'first';
  }

  closeAccordion() {
    this.accordionGroup.value = undefined;
    // resetta l'animazione del datetime quando si chiude
    this.onDragUpdate(0);
  }

  // NUOVO: Funzione che gestisce l'animazione del datetime
  onDragUpdate(progress: number) {
    if (!this.datetimeEl) return;

    // calcola l'effetto desiderato
    const scale = 1 - progress * 0.05; // Scala da 1 a 0.95
    const opacity = 1 - progress * 0.3; // Opacità da 1 a 0.7

    this.datetimeEl.nativeElement.style.transform = `scale(${scale})`;
    this.datetimeEl.nativeElement.style.opacity = `${opacity}`;
  }

  highlightedDates = (isoString: string) => {
    const date = new Date(isoString);
    const utcDay = date.getUTCDate();

    if (utcDay % 5 === 0) {
      return {
        textColor: '#800080',
        backgroundColor: '#ffc0cb',
        border: '1px solid #e91e63',
      };
    }

    if (utcDay % 3 === 0) {
      return {
        textColor: 'var(--ion-color-secondary)',
        backgroundColor: 'rgb(var(--ion-color-secondary-rgb), 0.18)',
        border: '1px solid var(--ion-color-secondary-shade)',
      };
    }

    return undefined;
  };
}
