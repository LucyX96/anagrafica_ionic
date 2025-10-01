import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import iro from '@jaames/iro';
import { IonContent, IonText, IonButton, IonTitle, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-color-picker',
  templateUrl: './new-color-picker.component.html',
  styleUrls: ['./new-color-picker.component.scss'],
  imports: [IonContent, IonGrid, IonRow, IonCol, IonTitle, IonIcon], 
  standalone: true, 
})
export class NewColorPickerComponent implements OnInit {
  colorcode: string = '#ffffff'; 
  previousColor: string = '#ff0000';
  @Output() colorSelected = new EventEmitter<string>(); 
  constructor(private modalCtrl: ModalController) {}

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
    this.modalCtrl.dismiss(this.colorcode, 'confirm');
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}


