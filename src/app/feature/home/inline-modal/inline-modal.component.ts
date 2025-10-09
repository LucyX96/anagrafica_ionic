import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IonContent, IonFabButton, IonList, IonItem, IonLabel, Gesture, IonReorderGroup, IonReorder, IonModal, IonText, IonCol, IonRow, IonGrid, ModalController } from '@ionic/angular/standalone';
import { RoutineDetailComponent } from './routine-detail/routine-detail.component';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { PaletteService } from 'src/app/core/services/color-palette.service';
import { AsyncPipe } from '@angular/common';
import { ColorPaletteItem } from 'src/app/core/model/color-interface';

import { ReorderEndCustomEvent } from '@ionic/angular';
import { RoutineService } from 'src/app/core/services/routine.service';
import { DraggablePanelDirective } from 'src/app/core/directive/draggable-panel.directive';
import { DayItem } from 'src/app/core/model/day-item-exercise-interface';

@Component({
  selector: 'app-inline-modal',
  templateUrl: './inline-modal.component.html',
  styleUrls: ['./inline-modal.component.scss'],
  imports: [
    IonContent,
    IonFabButton,
    IonList,
    IonItem,
    IonLabel,
    IonReorderGroup,
    IonReorder,
    MatIcon,
    AsyncPipe,
    DraggablePanelDirective,
    IonText
],
})
export class InlineModalComponent implements OnInit, OnDestroy {
  @ViewChild('header', { read: ElementRef }) headerEl!: ElementRef;
  @Output() draggedDown = new EventEmitter<void>();
  @Output() dragProgress = new EventEmitter<number>();

  public routines$ = this.routineService.routines$; 
  public palette$!: Observable<ColorPaletteItem[]>;
  private paletteSubscription!: Subscription;
  private gesture!: Gesture;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private paletteService: PaletteService,
    private routineService: RoutineService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.palette$ = this.paletteService.palette$;
    this.paletteSubscription = this.palette$.subscribe((palette) => {
      console.log('📥 Nuova palette:', palette);
    });
  }

  async openRoutineDetailModal(item: DayItem) {
    const currentPalette = await firstValueFrom(this.palette$);
    const modal = await this.modalCtrl.create({
      component: RoutineDetailComponent, 
      
      componentProps: {
        colors: currentPalette,
        currentItem: item,
      },

      initialBreakpoint: 0.65,
      breakpoints: [0.65],
      handle: false
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      console.log('Modale chiuso con conferma, dati ricevuti:', data);
      this.routineService.updateRoutine(data);
    }
  }

  handleReorderEnd(event: ReorderEndCustomEvent) {
    event.detail.complete();
  }

  ngOnDestroy() {
    this.paletteSubscription?.unsubscribe();
  }

  public resetPosition() {
    this.renderer.setStyle(this.elRef.nativeElement, 'transform', '');
  }
}
