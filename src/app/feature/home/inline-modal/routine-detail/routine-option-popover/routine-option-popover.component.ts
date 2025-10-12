import { Component, Input } from '@angular/core';
import {
  PopoverController,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-routine-option-popover',
  templateUrl: './routine-option-popover.component.html',
  styleUrls: ['./routine-option-popover.component.scss'],
  imports: [IonList, IonItem, IonLabel, IonIcon, IonContent],
})
export class RoutineOptionPopoverComponent {
  @Input() itemId!: number;

  constructor(private popoverCtrl: PopoverController) {}

  delete() {
    this.popoverCtrl.dismiss({ action: 'delete', id: this.itemId });
  }

  copy() {
    throw new Error('Method not implemented.');
  }
}
