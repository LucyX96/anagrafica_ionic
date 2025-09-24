import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonImg, IonAvatar, IonLabel } from "@ionic/angular/standalone";
import { TitleEmitterDirective } from 'src/app/core/directive/title-emitter';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  imports: [IonContent, IonItem, IonList, IonImg, IonAvatar, IonLabel]
})
export class BodyComponent extends TitleEmitterDirective implements OnInit {

  override title: string = 'History';

  constructor() {
    super(); 
  }

}
