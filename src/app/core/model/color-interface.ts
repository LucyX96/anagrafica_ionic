export interface DayItem {
  id: number,
  label: string,
  color: any,
  exercise: Exercise[]
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