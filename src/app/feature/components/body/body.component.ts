import { Component, OnInit } from '@angular/core';
import { TitleEmitterDirective } from 'src/app/core/directive/title-emitter';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  imports: [],
})
export class BodyComponent extends TitleEmitterDirective implements OnInit {
  // @ViewChild('accordionGroup', { static: true })
  // accordionGroup!: IonAccordionGroup;
  // @ViewChild('datetime', { read: ElementRef }) datetimeEl!: ElementRef;

  override title: string = 'Body';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // this.openAccordion();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // openAccordion() {
  //   this.accordionGroup.value = 'first';
  // }

  // closeAccordion() {
  //   this.accordionGroup.value = undefined;
  //   // resetta l'animazione del datetime quando si chiude
  //   this.onDragUpdate(0);
  // }

  // // NUOVO: Funzione che gestisce l'animazione del datetime
  // onDragUpdate(progress: number) {
  //   if (!this.datetimeEl) return;

  //   // calcola l'effetto desiderato
  //   const scale = 1 - progress * 0.05; // Scala da 1 a 0.95
  //   const opacity = 1 - progress * 0.3; // Opacità da 1 a 0.7

  //   this.datetimeEl.nativeElement.style.transform = `scale(${scale})`;
  //   this.datetimeEl.nativeElement.style.opacity = `${opacity}`;
  // }
}
