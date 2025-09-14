import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonApp, IonRouterOutlet, Platform, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, NavController } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from "./feature/header/header.component";
import { FooterComponent } from "./feature/footer/footer.component";
import { CommonModule } from '@angular/common';
import { PlatformService } from './core/services/platform.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
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
    // this.isMobile = this.platform.is('capacitor') || this.platform.is('android') || this.platform.is('ios');

    // if (this.isMobile) {
    //   // Configura status bar
    //   StatusBar.setStyle({ style: Style.Light });
    //   StatusBar.setBackgroundColor({ color: '#1976d2' }); // colore toolbar
    // }
  }

  navigateTo(path: string) {
    this.router.navigateForward(path);
  }
}
