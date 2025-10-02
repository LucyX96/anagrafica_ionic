import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonFooter,
  IonHeader,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { SwipeBackDirective } from './core/directive/swipe-back.directive';
import { PlatformService } from './core/services/platform.service';
import { FooterComponent } from './feature/footer/footer.component';
import { HeaderComponent } from './feature/header/header.component';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

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
  imports: [
    IonApp,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    RouterOutlet,
    MatToolbarModule,
    IonFooter,
    HeaderComponent,
    FooterComponent,
    SwipeBackDirective
  ],
})
export class AppComponent implements OnInit {
  title = 'anagrafica-fe';
  isMobile = false;
  statusBarHeight = 0;

  @ViewChild(HeaderComponent) appHeader!: HeaderComponent;

  private childTitleSub?: Subscription;
  private shareTextSub?: Subscription;

  constructor(
    private router2: NavController,
    private platform: Platform,
    private router: Router
  ) {
    this.initializeApp();
  }

  // viene chiamato quando il router crea un nuovo componente
  onActivate(componentRef: any) {
    this.appHeader.onChildTitleChange(null);
    this.childTitleSub?.unsubscribe();
    this.childTitleSub = undefined;
    this.shareTextSub?.unsubscribe();
    this.shareTextSub = undefined;

    if (
      componentRef &&
      componentRef.titleChange &&
      typeof componentRef.titleChange.subscribe === 'function'
    ) {
      this.childTitleSub = componentRef.titleChange.subscribe(
        (title: string | null) => {
          this.appHeader.onChildTitleChange(title);
        }
      );
    } else if (componentRef && componentRef.pageTitle) {
      this.appHeader.onChildTitleChange(componentRef.pageTitle);
    } else {
      this.appHeader.onChildTitleChange(null);
    }

    if (
      componentRef &&
      componentRef.shareTextChange &&
      typeof componentRef.shareTextChange.subscribe === 'function'
    ) {
      this.shareTextSub = componentRef.shareTextChange.subscribe(
        (text: string | null) => {
          this.appHeader.onChildShareTextChange(text);
        }
      );
    } else if (componentRef && componentRef.pageShareText) {
      this.appHeader.onChildShareTextChange(componentRef.pageShareText);
    } else {
      this.appHeader.onChildShareTextChange(null);
    }
  }

  ngOnDestroy() {
    this.childTitleSub?.unsubscribe();
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

  ngOnInit() {}

  navigateTo(path: string) {
    this.router2.navigateForward(path);
  }
}
