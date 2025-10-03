import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColorPaletteItem } from '../model/color-interface';

@Injectable({
  providedIn: 'root' // Questo rende il servizio disponibile in tutta l'app
})
export class PaletteService {

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
        { id: 1, color: '#f94747ff' },
        { id: 2, color: '#3366ccff' }
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

  public addNewColor(hexColor: string): void {
    const currentPalette = this.getCurrentPalette();
    const newColor: ColorPaletteItem = {
      id: Date.now(),
      color: hexColor,
    };
    const updatedPalette = [...currentPalette, newColor];
    this.savePalette(updatedPalette);
  }

  public removeColor(idToRemove: number): void {
    const currentPalette = this.getCurrentPalette();
    // Filtra la palette escludendo l'ID da rimuovere
    const updatedPalette = currentPalette.filter(item => item.id !== idToRemove);
    // Salva e notifica l'aggiornamento
    this.savePalette(updatedPalette);
  }
}