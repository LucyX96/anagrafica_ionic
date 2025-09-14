import { ValidatorFn, Validators } from "@angular/forms";

export interface StepperConfigInterface {
  label: string;
  groupName?: string; // nome dell’oggetto annidato nel JSON, es. 'documentoDto'
  controls: { name: string; placeholder: string; validators: ValidatorFn[] }[];
}



