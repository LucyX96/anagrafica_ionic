export interface DayItem {
  id: number,
  label: string,
  color: any,
  colorLabel: string,
  exercise: Exercise[],
  selectedExerciseId?: number | null;
}

export interface Exercise {
  id: number,
  label: string,
  color: any
}