import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { IonApp, IonContent, IonFooter, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { PlatformService } from './core/services/platform.service';
import { FooterComponent } from "./feature/footer/footer.component";
import { HeaderComponent } from "./feature/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonHeader, IonToolbar, IonTitle, IonContent, RouterOutlet, MatToolbarModule, IonFooter, HeaderComponent, FooterComponent, CommonModule],
})
export class AppComponent implements OnInit {
  title = 'anagrafica-fe';
  isMobile = false;
  statusBarHeight = 0;

  constructor(private router: NavController, platform: PlatformService, renderer: Renderer2) {
    if (platform.isMobile) {
      renderer.addClass(document.body, 'mobile');
    } else {
      renderer.addClass(document.body, 'web');
    }
  }


  ngOnInit() {
    
  }

  navigateTo(path: string) {
    this.router.navigateForward(path);
  }
}
