export interface DayItem {
  id: number,
  label: string,
  color: any,
  colorLabel: string,
  exercise: Exercise[],
  selectedExerciseId?: number | null;
}

export interface ColorPaletteItem {
  id: number,
  color: string,
}

export interface Exercise {
  id: number,
  label: string,
  color: any
}