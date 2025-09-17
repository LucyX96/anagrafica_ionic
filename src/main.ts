import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { provideHttpClient } from '@angular/common/http';
import 'hammerjs';
import { addIcons } from 'ionicons';
import { logInSharp, logOutSharp, menu, personAddSharp, personCircleSharp, personRemoveSharp, personSharp, remove, reorderThree } from 'ionicons/icons';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

addIcons({
  reorderThree,
  remove,
  menu,
  personSharp,
  personAddSharp,
  personRemoveSharp,
  personCircleSharp,
  logInSharp,
  logOutSharp
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
