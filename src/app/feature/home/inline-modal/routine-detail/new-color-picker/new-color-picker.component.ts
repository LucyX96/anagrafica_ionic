import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import iro from '@jaames/iro';
import {
  IonContent,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-new-color-picker',
  templateUrl: './new-color-picker.component.html',
  styleUrls: ['./new-color-picker.component.scss'],
  imports: [IonContent, IonText, IonButton], 
  standalone: true, 
})
export class NewColorPickerComponent implements OnInit {
  colorcode: string = '#ffffff'; 
  @Output() colorSelected = new EventEmitter<string>(); 
  constructor() {}

  ngOnInit() {
    let ref = this;
    var colorPicker = iro.ColorPicker('#picker', {
      width: 160,
      color: this.colorcode,
    });

    colorPicker.on('color:change', function (color: { hexString: string }) {
      ref.colorcode = color.hexString;
    });
  }

  confirmColorSelection() {
    this.colorSelected.emit(this.colorcode);
  }
}


