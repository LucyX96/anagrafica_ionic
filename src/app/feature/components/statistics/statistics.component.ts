import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonList, IonItem, IonAvatar, IonImg, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports: [IonContent, IonList, IonItem, IonAvatar, IonImg, IonLabel]
})
export class StatisticsComponent implements OnInit {

  @Output() titleChange = new EventEmitter<string | null>();

  constructor() { }
  
  ngOnInit() {
    this.titleChange.emit('Statistics');
  }

  ngOnDestroy() {
    this.titleChange.emit(null);
  }

}
