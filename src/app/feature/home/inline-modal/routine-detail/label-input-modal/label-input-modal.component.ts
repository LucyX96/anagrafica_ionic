import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonButton, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-label-input-modal',
  templateUrl: './label-input-modal.component.html',
  styleUrls: ['./label-input-modal.component.scss'],
  standalone: true,
  imports: [IonButton, IonInput, FormsModule],
})
export class LabelInputModalComponent {
  @Input() title!: string;
  @Input() message?: string;
  @Input() showInput: boolean = false;
  @Input() inputLabel?: string;
  @Input() inputMaxLength: number = 50;
  @Input() action?: string;

  inputValue: string = '';

  constructor(private modalCtrl: ModalController) {}

  confirm() {
    if (this.showInput && !this.inputValue.trim()) return;
    this.modalCtrl.dismiss(this.inputValue || true, 'confirm');
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}

