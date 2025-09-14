export interface DocumentoInterface {
  tipo: string;
  numero: string;
  rilasciatoDa: string;
  dataRilascio: string;   // formato ISO es. '2025-08-27'
  dataScadenza: string;   // formato ISO
}

export interface IndirizzoInterface {
  via: string;
  numeroCivico: string;
  cap: string;
  comune: string;
  provincia: string;
  stato: string;
}

export interface LuogoInterface {
  comune: string;
  provincia: string;
  stato: string;
}

export interface PersonaInterface {
  nome: string;
  cognome: string;
  sesso: string;
  codiceFiscale: string;
  dataNascita: string;     // formato ISO es. '2025-08-27'
  cittadinanza: string;
  statoCivile: string;
  titoloStudio: string;
  professione: string;
  numeroFigli: number | null;
  email: string;
  telefono: string;
  note: string;
  documentoDto: DocumentoInterface;
  indirizzoDto: IndirizzoInterface;
  luogoDto: LuogoInterface;
}

export interface PersonaSearchInterface {
  id: number,
  nome: string,
  cognome: string,
  codiceFiscale: string,
  email: string,
  telefono: string
}
