import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { JwtInterceptor } from './app/core/interceptors/jwt-interceptor';
import { CustomRouteReuseStrategy } from './app/core/route-strategy/custom-route-reuse.strategy';


addIcons({
  ...appIcons
});

bootstrapApplication(AppComponent, {
  providers: [

    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideIonicAngular(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(IonicModule.forRoot({innerHTMLTemplatesEnabled: true})),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: UserLoginService,
      useFactory: (http: HttpClient) => {
        return environment.mock ? new MockUserLoginService() : new UserLoginService(http);
      },
      deps: [HttpClient]
    },

    // Provider per l'Interceptor JWT
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }

    
  ],
});
