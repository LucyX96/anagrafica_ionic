import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import 'hammerjs';
import { addIcons } from 'ionicons';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { appIcons } from './app/ionicons.module';
import { UserLoginService } from './app/core/services/user-login.service';
import { MockUserLoginService } from './app/core/services/mock-user-service';
import { environment } from './environments/environment';


addIcons({
  ...appIcons
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({innerHTMLTemplatesEnabled: true})),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    {
      provide: UserLoginService,
      useFactory: (http: HttpClient) => {
        return environment.mock ? new MockUserLoginService() : new UserLoginService(http);
      },
      deps: [HttpClient]
    }
  ],
});
