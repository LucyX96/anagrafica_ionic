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
import { IonContent, IonFabButton, IonList, IonItem, IonLabel, Gesture, IonReorderGroup, IonReorder, IonModal, IonText } from '@ionic/angular/standalone';
import { RoutineDetailComponent } from './routine-detail/routine-detail.component';
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
    IonFabButton,
    IonList,
    IonItem,
    IonLabel,
    IonReorderGroup,
    IonReorder,
    MatIcon,
    IonModal,
    RoutineDetailComponent,
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
    private routineService: RoutineService
  ) {}

  ngOnInit() {
    this.palette$ = this.paletteService.palette$;
    this.paletteSubscription = this.palette$.subscribe((palette) => {
      console.log('📥 Nuova palette:', palette);
    });
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
