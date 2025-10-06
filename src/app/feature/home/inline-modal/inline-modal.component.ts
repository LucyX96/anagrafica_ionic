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
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  Gesture,
  IonReorderGroup,
  IonReorder,
  IonModal,
  IonFabList,
  ModalController,
} from '@ionic/angular/standalone';
import { RoutineDetailComponent } from './routine-detail/routine-detail.component';
import { AddItemModalComponent } from './routine-detail/add-item-modal/add-item-modal.component';
import { Observable, Subscription } from 'rxjs';
import { PaletteService } from 'src/app/core/services/color-palette.service';
import { AsyncPipe } from '@angular/common';
import { ColorPaletteItem } from 'src/app/core/model/color-interface';

import { ReorderEndCustomEvent } from '@ionic/angular';
import { RoutineService } from 'src/app/core/services/routine.service';
import { DraggablePanelDirective } from 'src/app/core/directive/draggable-panel.directive';

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
    IonLabel,
    IonReorderGroup,
    IonReorder,
    MatIcon,
    IonModal,
    RoutineDetailComponent,
    IonFabList,
    AsyncPipe,
    DraggablePanelDirective
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
    private modalCtrl: ModalController,
    private paletteService: PaletteService,
    private routineService: RoutineService
  ) {}

  ngOnInit() {
    this.palette$ = this.paletteService.palette$;
    this.paletteSubscription = this.palette$.subscribe((palette) => {
      console.log('📥 Nuova palette:', palette);
    });
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
