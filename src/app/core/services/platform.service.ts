import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  readonly isMobile: boolean;

  constructor(private platform: Platform) {
      this.isMobile =
        this.platform.is('capacitor') ||
        this.platform.is('android') ||
        this.platform.is('ios');

    //test forzatura 
    // this.isMobile = environment.forceMobile || this.platform.is('android') || this.platform.is('ios');

  }
}
