import { Component, EventEmitter, Output } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  imports: [IonButton, IonIcon],
})
export class ColorPickerComponent {
  @Output() colorSelected = new EventEmitter<string>();
  currentColor: string = '#4c8dff';

  constructor() {}

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.currentColor = color;
  }

  selectColor() {
    this.colorSelected.emit(this.currentColor);
  }
}
