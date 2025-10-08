import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonDatetime,
  IonItem,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { TitleEmitterDirective } from 'src/app/core/directive/title-emitter';
import { InlineModalComponent } from './inline-modal/inline-modal.component';
import { RoutineService } from 'src/app/core/services/routine.service';
import { PaletteService } from 'src/app/core/services/color-palette.service';
import { AddItemModalComponent } from './inline-modal/routine-detail/add-item-modal/add-item-modal.component';

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
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
  ],
})
export class HomePage extends TitleEmitterDirective implements OnInit {
  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;
  @ViewChild('datetime', { read: ElementRef }) datetimeEl!: ElementRef;

  @ViewChild(InlineModalComponent) inlineModal!: InlineModalComponent;

  override title: string = 'Home';

  constructor(
    private cdr: ChangeDetectorRef,
    private routineService: RoutineService,
    private paletteService: PaletteService,
    private modalCtrl: ModalController
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.openAccordion();
    this.accordionGroup.value = 'first';
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  async openAddItemModal() {
    const availableColors = this.paletteService.getCurrentPalette();

    const modal = await this.modalCtrl.create({
      component: AddItemModalComponent,
      componentProps: { availableColors },
      initialBreakpoint: 0.65,
      breakpoints: [0.65],
      handle: false,
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.routineService.addRoutine(data.label, data.color);
    }
  }

  openAccordion() {
    this.accordionGroup.value = 'first';
    this.onDragUpdate(0);
    this.cdr.detectChanges();
  }

  closeAccordion() {
    this.accordionGroup.value = undefined;
    this.onDragUpdate(0);
    if (this.inlineModal) {
      this.inlineModal.resetPosition();
    }
    this.cdr.detectChanges();
  }

  accordionStateChanged(event: any) {
    const isOpen = event.detail.value === 'first';
    const progress = isOpen ? 1 : 0;
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
