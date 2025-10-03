import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DayItem } from '../model/color-interface'; 

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  private readonly storageKey = 'userRoutines';

  private readonly routinesSubject = new BehaviorSubject<DayItem[]>(this.loadRoutinesFromStorage());

  public readonly routines$ = this.routinesSubject.asObservable();

  constructor() { }

  private loadRoutinesFromStorage(): DayItem[] {
    const savedRoutines = localStorage.getItem(this.storageKey);
    if (savedRoutines) {
      console.log('💾 [RoutineService] Routine caricate da localStorage.');
      return JSON.parse(savedRoutines);
    } else {
      console.log('💡 [RoutineService] Nessuna routine salvata, inizio con un array vuoto.');
      return []; 
    }
  }

  private saveRoutines(routines: DayItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(routines));
    this.routinesSubject.next(routines);
    console.log('✅ [RoutineService] Routine salvate e stato aggiornato.');
  }

  public getCurrentRoutines(): DayItem[] {
    return this.routinesSubject.getValue();
  }


  public addRoutine(label: string, color: string): void {
    const currentRoutines = this.getCurrentRoutines();
    const newRoutine: DayItem = {
      id: Date.now(),
      label: label,
      color: color,
    };
    const updatedRoutines = [...currentRoutines, newRoutine];
    this.saveRoutines(updatedRoutines);
  }

  public updateRoutine(updatedRoutine: DayItem): void {
    const currentRoutines = this.getCurrentRoutines();
    const updatedRoutines = currentRoutines.map(routine =>
      routine.id === updatedRoutine.id ? updatedRoutine : routine
    );
    this.saveRoutines(updatedRoutines);
  }

  public removeRoutine(idToRemove: number): void {
    const currentRoutines = this.getCurrentRoutines();
    const updatedRoutines = currentRoutines.filter(routine => routine.id !== idToRemove);
    this.saveRoutines(updatedRoutines);
  }
}