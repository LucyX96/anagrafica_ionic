import { Component, EventEmitter, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonTitle, IonList, IonItem, IonAvatar, IonImg, IonLabel } from "@ionic/angular/standalone";
import { TitleEmitterDirective } from 'src/app/core/directive/title-emitter';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  imports: [IonContent, IonList, IonItem, IonAvatar, IonImg, IonLabel]
})
export class HistoryComponent extends TitleEmitterDirective implements OnInit  {

  
  override title: string = 'History';

  constructor() {
    super(); 
  }

  override ngOnInit(): void {
    super.ngOnInit(); // importante chiamare il metodo della classe base
    // qui la logica specifica del componente
    console.log('HistoryComponent initialized!');
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy(); // importante chiamare il metodo della classe base
    // qui la logica specifica del componente
    console.log('HistoryComponent destroyed!');
  }

}
