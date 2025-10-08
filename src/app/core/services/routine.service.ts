import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences'; // 1. Importa il plugin
import { DayItem } from '../model/day-item-exercise-interface';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private readonly storageKey = 'userRoutines';
  private readonly routinesSubject = new BehaviorSubject<DayItem[]>([]);
  public readonly routines$ = this.routinesSubject.asObservable();

  constructor() {
    this.loadRoutinesFromStorage(); 
  }

  private async loadRoutinesFromStorage(): Promise<void> {
    const { value } = await Preferences.get({ key: this.storageKey });
    
    if (value) {
      console.log('💾 [RoutineService] Routine caricate da Preferences.');
      this.routinesSubject.next(JSON.parse(value)); // Aggiorna il BehaviorSubject
    } else {
      console.log(
        '💡 [RoutineService] Nessuna routine salvata, inizio con un array vuoto.'
      );
      this.routinesSubject.next([]); // Assicurati che lo stato sia un array vuoto
    }
  }

  private async saveRoutines(routines: DayItem[]): Promise<void> {
    await Preferences.set({
      key: this.storageKey,
      value: JSON.stringify(routines),
    });
    
    this.routinesSubject.next(routines);
    console.log('✅ [RoutineService] Routine salvate in Preferences e stato aggiornato.');
  }

  public getCurrentRoutines(): DayItem[] {
    return this.routinesSubject.getValue();
  }

  public async addRoutine(label: string, color: string): Promise<void> {
    const currentRoutines = this.getCurrentRoutines();
    let labelColor: string = '#5b636fff';
    const newRoutine: DayItem = {
      id: Date.now(),
      label: label,
      color: color,
      exercise: [
        { id: 1, label: 'Lun', color: labelColor },
        { id: 2, label: 'Mer', color: labelColor },
        { id: 3, label: 'Ven', color: labelColor },
      ],
      colorLabel: ''
    };

    newRoutine.colorLabel = newRoutine.exercise[0].label;
    const updatedRoutines = [...currentRoutines, newRoutine];
    await this.saveRoutines(updatedRoutines);
  }

  public async updateRoutine(updatedRoutine: DayItem): Promise<void> {
    const currentRoutines = this.getCurrentRoutines();
    const updatedRoutines = currentRoutines.map((routine) =>
      routine.id === updatedRoutine.id ? updatedRoutine : routine
    );
    await this.saveRoutines(updatedRoutines);
  }

  public async removeRoutine(idToRemove: number): Promise<void> {
    const currentRoutines = this.getCurrentRoutines();
    const updatedRoutines = currentRoutines.filter(
      (routine) => routine.id !== idToRemove
    );
    await this.saveRoutines(updatedRoutines);
  }
}