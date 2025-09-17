import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { IonApp, IonContent, IonFooter, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { SwipeBackDirective } from './core/directive/swipe-back.directive';
import { PlatformService } from './core/services/platform.service';
import { FooterComponent } from "./feature/footer/footer.component";
import { HeaderComponent } from "./feature/header/header.component";
import { Platform } from '@ionic/angular';

declare global {
  interface Navigator {
    app?: {
      exitApp: () => void;
    };
  }
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonHeader, IonToolbar, IonTitle, IonContent, RouterOutlet, MatToolbarModule, IonFooter, HeaderComponent, FooterComponent, SwipeBackDirective],
})
export class AppComponent implements OnInit {
  title = 'anagrafica-fe';
  isMobile = false;
  statusBarHeight = 0;

  constructor(private router2: NavController, private platform: Platform, private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.handleAndroidBackButton();
    });
  }

  handleAndroidBackButton() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/home') {
        navigator['app']!.exitApp();
      } else {
        this.router.navigate(['../']);
      }
    });
  }


  ngOnInit() {
    
  }

  navigateTo(path: string) {
    this.router2.navigateForward(path);
  }
}
