import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PersonaInterface } from 'src/app/core/model/anagrafica-interface';
import { StepperConfigInterface } from 'src/app/core/model/stepper-config-interface';
import { PersonaService } from 'src/app/core/services/persona.service';
import { PlatformService } from 'src/app/core/services/platform.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    MaterialModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class RegisterComponent implements OnInit {

  stepConfig: StepperConfigInterface[] = [
    {
      label: 'Dati Personali 1',
      controls: [
        { name: 'nome', placeholder: 'Nome', validators: [Validators.required] },
        { name: 'cognome', placeholder: 'Cognome', validators: [Validators.required] },
        { name: 'sesso', placeholder: 'Sesso', validators: [] },
        { name: 'codiceFiscale', placeholder: 'Codice Fiscale', validators: [] },
        { name: 'dataNascita', placeholder: 'Data di Nascita', validators: [] },
        { name: 'cittadinanza', placeholder: 'Cittadinanza', validators: [] }
      ],
    },
    {
      label: 'Dati Personali 2',
      controls: [
        { name: 'statoCivile', placeholder: 'Stato Civile', validators: [] },
        { name: 'titoloStudio', placeholder: 'Titolo di Studio', validators: [] },
        { name: 'professione', placeholder: 'Professione', validators: [] },
        { name: 'numeroFigli', placeholder: 'Numero Figli', validators: [] },
        { name: 'email', placeholder: 'Email', validators: [Validators.email] },
        { name: 'telefono', placeholder: 'Telefono', validators: [] },
        { name: 'note', placeholder: 'Note', validators: [] },
      ],
    },
    {
      label: 'Documento',
      groupName: 'documentoDto',
      controls: [
        { name: 'tipo', placeholder: 'Tipo Documento', validators: [] },
        { name: 'numero', placeholder: 'Numero Documento', validators: [] },
        { name: 'rilasciatoDa', placeholder: 'Rilasciato da', validators: [] },
        { name: 'dataRilascio', placeholder: 'Data di Rilascio', validators: [] },
        { name: 'dataScadenza', placeholder: 'Data di Scadenza', validators: [] },
      ],
    },
    {
      label: 'Indirizzo',
      groupName: 'indirizzoDto',
      controls: [
        { name: 'via', placeholder: 'Via', validators: [] },
        { name: 'numeroCivico', placeholder: 'Numero Civico', validators: [] },
        { name: 'cap', placeholder: 'CAP', validators: [] },
        { name: 'comune', placeholder: 'Comune', validators: [] },
        { name: 'provincia', placeholder: 'Provincia', validators: [] },
        { name: 'stato', placeholder: 'Stato', validators: [] },
      ],
    },
    {
      label: 'Luogo',
      groupName: 'luogoDto',
      controls: [
        { name: 'comune', placeholder: 'Comune', validators: [] },
        { name: 'provincia', placeholder: 'Provincia', validators: [] },
        { name: 'stato', placeholder: 'Stato', validators: [] },
      ],
    }
  ];

  isLinear = false;

  stepForms: FormGroup[] = [];
  currentStep = 0;

  persona: PersonaInterface = {
    nome: '',
    cognome: '',
    sesso: '',
    codiceFiscale: '',
    dataNascita: '',
    cittadinanza: '',
    statoCivile: '',
    titoloStudio: '',
    professione: '',
    numeroFigli: null,
    email: '',
    telefono: '',
    note: '',
    documentoDto: {
      tipo: '',
      numero: '',
      rilasciatoDa: '',
      dataRilascio: '',
      dataScadenza: '',
    },
    indirizzoDto: {
      via: '',
      numeroCivico: '',
      cap: '',
      comune: '',
      provincia: '',
      stato: '',
    },
    luogoDto: {
      comune: '',
      provincia: '',
      stato: '',
    }
  };


  constructor(private fb: FormBuilder, private personaService: PersonaService, public platform: PlatformService) { }

  ngOnInit() {
    this.stepForms = this.stepConfig.map(step => {
      const controlsConfig: any = {};
      step.controls.forEach(control => {
        let initialValue = '';
        if (step.groupName) {
          const groupData = (this.persona as any)[step.groupName] || {};
          initialValue = groupData[control.name] ?? '';
        } else {
          initialValue = (this.persona as any)[control.name] ?? '';
        }
        controlsConfig[control.name] = [initialValue, control.validators];
      });
      return this.fb.group(controlsConfig);
    });
  }

  nextStep() {
    if (this.isStepValid(this.currentStep) && this.currentStep < this.stepForms.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isStepValid(index: number): boolean {
    return this.stepForms[index].valid;
  }

  showStep(index: number): boolean {
    return this.currentStep === index;
  }

  resetStepper() {
    this.stepForms.forEach(form => form.reset());
    this.currentStep = 0;
  }

  submitStepper(stepper: any) {
    // ricostruisce PersonaInterface a partire dai form
    const persona: PersonaInterface = {
      ...this.stepForms[0].value, // dati personali base
      ...this.stepForms[1].value, // dati personali seconda parte
      documentoDto: this.stepForms[2].value,
      indirizzoDto: this.stepForms[3].value,
      luogoDto: this.stepForms[4].value
    };

    this.personaService.registerPersona(persona).subscribe({
      next: res => {
        console.log('Registrazione completata', res);
        this.resetStepper();
      },
      error: err => {
        console.error('Errore registrazione', err);
      }
    });
  }

}
