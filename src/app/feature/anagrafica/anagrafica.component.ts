import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PersonaSearchInterface } from 'src/app/core/model/anagrafica-interface';
import { PersonaService } from 'src/app/core/services/persona.service';
import { MaterialModule } from 'src/app/material.module';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-anagrafica',
  templateUrl: './anagrafica.component.html',
  styleUrls: ['./anagrafica.component.scss'],
  imports: [
    MaterialModule,
    SearchComponent
  ],
  standalone: true
})
export class AnagraficaComponent implements OnInit {

  searchForm!: FormGroup;
  displayedColumns: string[] = ['id', 'nome', 'cognome', 'codiceFiscale', 'email', 'telefono'];
  dataSource: PersonaSearchInterface[] = [];
  test: string = 'ciao';

  constructor(private fb: FormBuilder, private personaService: PersonaService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      nome: [''],
      cognome: [''],
      codiceFiscale: [''],
      email: [''],
      telefono: ['']
    });
    this.onSearch();
  }

  onSearch(): void {
    const criteria = this.searchForm.value;
    this.personaService.searchPersone(criteria).subscribe({
      next: (res: PersonaSearchInterface[]) => {
        this.dataSource = res;
        this.test = 'arrivederci' + new Date();
      },
      error: err => console.error('Search error', err)
    });
  }

  onReset(): void {
    this.searchForm.reset();
    this.dataSource = [];
    this.onSearch();
  }

}
