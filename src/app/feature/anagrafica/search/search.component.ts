import { Component, Input, OnInit } from '@angular/core';
import { PersonaSearchInterface } from 'src/app/core/model/anagrafica-interface';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [MaterialModule]
})
export class SearchComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'cognome', 'codiceFiscale', 'email', 'telefono'];

@Input() dataSource: PersonaSearchInterface[] = [];

  constructor() { }

  ngOnInit() {
  }

}
