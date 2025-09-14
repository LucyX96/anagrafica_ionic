import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonaInterface, PersonaSearchInterface } from '../model/anagrafica-interface';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {


  private apiUrl = 'http://localhost:8080'; // URL backend



  constructor(private http: HttpClient) { }

  registerPersona(persona: PersonaInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/java/persone/form`, persona);
  }

  searchPersone(persona: PersonaSearchInterface): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/java/persone/search`, {
      params: {
        ...(persona.nome ? { nome: persona.nome } : {}),
        ...(persona.cognome ? { cognome: persona.cognome } : {}),
        ...(persona.codiceFiscale ? { codiceFiscale: persona.codiceFiscale } : {}),
        ...(persona.email ? { email: persona.email } : {}),
        ...(persona.telefono ? { telefono: persona.telefono } : {})
      }
    });
  }



}
