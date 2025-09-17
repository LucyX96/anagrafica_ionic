import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrls: ['./footer.component.scss'],
  imports: [IonButton, IonIcon]
})
export class FooterComponent implements OnInit {

  constructor() { 
    
  }

  ngOnInit() {
  }

}
