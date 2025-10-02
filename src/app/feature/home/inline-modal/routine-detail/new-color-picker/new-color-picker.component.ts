import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import iro from '@jaames/iro';
import { IonContent, IonText, IonButton, IonTitle, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { ColorPickerComponent } from "./color-picker/color-picker.component";
import { ColorPaletteItem, DayItem } from '../routine-detail.component';

@Component({
  selector: 'app-new-color-picker',
  templateUrl: './new-color-picker.component.html',
  styleUrls: ['./new-color-picker.component.scss'],
  imports: [IonContent, IonGrid, IonRow, IonCol, IonTitle, IonIcon, ColorPickerComponent], 
  standalone: true, 
})
export class NewColorPickerComponent implements OnInit {
  colorcode: string = '#ffffff'; 
  previousColor: string = '#ff0000';
  @Output() colorSelected = new EventEmitter<string>(); 
  @Input() colors: ColorPaletteItem[] = [];
  @Input() currentItem!: DayItem;
  @Output() itemUpdated = new EventEmitter<DayItem>();

  items: DayItem[] = [];
  colorPalette: ColorPaletteItem[] = [];


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

   //test
  public currentColor: string = '#1A65EB';

  onColorChange(color: string) {
    console.log('Nuovo colore selezionato:', color);
    this.currentColor = color;
  }

  //fine test

  //test
  // async openColorPicker() {
  //   const modal = await this.modalCtrl.create({
  //     component: NewColorPickerComponent,
  //     componentProps: {
  //       color: this.currentColor // Passa il colore corrente alla modale
  //     },
  //     initialBreakpoint: 0.65,
  //     breakpoints: [0, 0.65]
  //   });
    
  //   await modal.present();

  //   const { data, role } = await modal.onWillDismiss();
  //   if (role === 'confirm' && data) {
  //     this.addColorToPalette(data);
  //   }

  // }

  addColorToPalette(hexColor: string) {
      console.log('Colore ricevuto dal figlio:', hexColor);
  
      const colorExists = this.colorPalette.some(
        (item) => item.color === hexColor
      );
  
      if (hexColor && !colorExists) {
        const newId = Date.now();
  
        const newColorItem: ColorPaletteItem = {
          id: newId,
          color: hexColor,
        };
  
        this.colorPalette.push(newColorItem);
      }
    }

    selectNewColorForRoutine(newColor: string) {
    if (this.currentItem) {
      this.currentItem.color = newColor;
      console.log('Nuovo colore selezionato per l\'item:', this.currentItem);
    }
  }

  saveAndClose() {
    this.itemUpdated.emit(this.currentItem);
    this.modalCtrl.dismiss();
  }

  
  //fine test

  confirmColorSelection() {
    this.colorSelected.emit(this.colorcode);
    this.modalCtrl.dismiss(this.colorcode, 'confirm');
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}


