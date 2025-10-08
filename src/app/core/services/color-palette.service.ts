import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColorPaletteItem } from '../model/color-interface';

@Injectable({
  providedIn: 'root' // Questo rende il servizio disponibile in tutta l'app
})
export class PaletteService {

  private readonly maxPaletteSize = 10;

  // 1. BehaviorSubject per mantenere lo stato corrente della palette.
  //    Inizializza il suo valore caricando i dati dal localStorage.
  private readonly paletteSubject = new BehaviorSubject<ColorPaletteItem[]>(this.loadPaletteFromStorage());

  // 2. Observable pubblico. I componenti si "iscriveranno" a questo per ricevere
  //    gli aggiornamenti. Il '$' è una convenzione per gli Observable.
  public readonly palette$ = this.paletteSubject.asObservable();

  constructor() { }

  /**
   * Carica la palette dal localStorage.
   * Questo metodo è privato perché la logica di caricamento
   * deve essere gestita solo all'interno del servizio.
   * @returns L'array di colori salvato o un valore di default.
   */
  private loadPaletteFromStorage(): ColorPaletteItem[] {
    const savedPalette = localStorage.getItem('userColorPalette');

    if (savedPalette) {
      return JSON.parse(savedPalette);
    } else {
      // Fornisci qui i colori di default se non c'è nulla di salvato
      return [
        { id: 1, color: '#9cfffa' },
        { id: 2, color: '#acf39d' },
        { id: 3, color: '#b0c592' },
        { id: 4, color: '#a97c73' },
        { id: 5, color: '#af3e4d' },
        { id: 6, color: '#3e5641' },
        { id: 7, color: '#a24936' },
        { id: 8, color: '#d36135' },
        { id: 9, color: '#83bca9' },

      ];
    }
  }

  /**
   * Salva la palette corrente nel localStorage e notifica
   * a tutti i componenti iscritti il nuovo valore.
   * @param palette L'intero array della palette da salvare.
   */
  public savePalette(palette: ColorPaletteItem[]): void {
    // 1. Salva la stringa nel localStorage
    localStorage.setItem('userColorPalette', JSON.stringify(palette));
    
    // 2. Emetti il nuovo valore attraverso il BehaviorSubject
    this.paletteSubject.next(palette);
  }

  /**
   * Metodo di utilità per ottenere il valore corrente della palette in modo sincrono.
   * @returns Il valore corrente della palette.
   */
  public getCurrentPalette(): ColorPaletteItem[] {
    return this.paletteSubject.getValue();
  }

   public addNewColor(hexColor: string): boolean {
    const currentPalette = this.getCurrentPalette();
    if (currentPalette.length === this.maxPaletteSize) {
      currentPalette[currentPalette.length-1].color = hexColor;
      this.savePalette(currentPalette);
      return true; 
    }

    const newColor: ColorPaletteItem = {
      id: Date.now(),
      color: hexColor,
    };

    const updatedPalette = [...currentPalette, newColor];
    this.savePalette(updatedPalette);
    
    return true;
  }

  public removeColor(idToRemove: number): void {
    const currentPalette = this.getCurrentPalette();
    const updatedPalette = currentPalette.filter(item => item.id !== idToRemove);
    this.savePalette(updatedPalette);
  }


public updateColor(idToUpdate: number, newHexColor: string): void {
  const currentPalette = this.getCurrentPalette();
  
  const itemIndex = currentPalette.findIndex(item => item.id === idToUpdate);

  if (itemIndex !== -1) {
    const updatedPalette = [...currentPalette];
    updatedPalette[itemIndex] = { ...updatedPalette[itemIndex], color: newHexColor };
    this.savePalette(updatedPalette);
  }
}
}