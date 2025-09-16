import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { IonCard, IonLabel, IonItem, IonList, IonInput, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  standalone: true,
  styleUrls: ['./user-register.component.scss'],
  imports: [IonButton, IonInput, IonList, IonItem, IonCard,
    MaterialModule]
})
export class UserRegisterComponent implements OnInit {

  register(arg0: any) {
    throw new Error('Method not implemented.');
  }
  constructor() { }

  ngOnInit() {
  }

}
