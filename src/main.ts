import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { provideHttpClient } from '@angular/common/http';
import 'hammerjs';
import { addIcons } from 'ionicons';
import { homeSharp, logInSharp, logOutSharp, menu, personAddSharp, personCircleSharp, personRemoveSharp, personSharp, reloadSharp, remove, reorderThree } from 'ionicons/icons';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';

addIcons({
  reorderThree,
  remove,
  menu,
  personSharp,
  personAddSharp,
  personRemoveSharp,
  personCircleSharp,
  logInSharp,
  logOutSharp,
  reloadSharp,
  homeSharp
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({innerHTMLTemplatesEnabled: true})),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
