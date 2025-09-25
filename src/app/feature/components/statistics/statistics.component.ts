import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonList, IonItem, IonAvatar, IonImg, IonLabel } from "@ionic/angular/standalone";
import { TitleEmitterDirective } from 'src/app/core/directive/title-emitter';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports: [IonContent, IonList, IonItem, IonAvatar, IonImg, IonLabel]
})
export class StatisticsComponent extends TitleEmitterDirective implements OnInit {
  override title: string = 'Statistics';

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
