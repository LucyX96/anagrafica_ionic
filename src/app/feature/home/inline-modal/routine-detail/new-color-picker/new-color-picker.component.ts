import { Component, Input, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonIcon, IonTitle } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-new-color-picker',
  templateUrl: './new-color-picker.component.html',
  styleUrls: ['./new-color-picker.component.scss'],
  imports: [IonContent, IonGrid, IonRow, IonCol, IonTitle, IonIcon, ColorPickerComponent], 
  standalone: true, 
})
export class NewColorPickerComponent implements OnInit {
  // Riceve il colore iniziale dal componente che apre il modale
  @Input() color: string = '#ff0000';

  // Proprietà interna per gestire il colore selezionato nel picker
  public currentColor: string = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // Inizializza il colore del picker con quello ricevuto in input
    this.currentColor = this.color;
  }

  /**
   * Aggiorna il colore corrente quando l'utente interagisce con app-color-picker.
   * @param color - Il nuovo colore selezionato.
   */
  onColorChange(color: string) {
    this.currentColor = color;
  }

  /**
   * Chiude il modale e restituisce il colore selezionato al componente padre.
   */
  confirmColorSelection() {
    this.modalCtrl.dismiss(this.currentColor, 'confirm');
  }

  /**
   * Chiude il modale senza restituire dati.
   */
  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}