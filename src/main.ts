import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { JwtInterceptor, ServerErrorInterceptor } from './app/lib/interceptors';
import { environment } from './environments/environment';
import { NU_MONACO_EDITOR_CONFIG,NuMonacoEditorModule } from '@ng-util/monaco-editor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(NuMonacoEditorModule.forRoot()),
    importProvidersFrom(RouterModule.forRoot(routes), HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
}).catch((error) => console.error(error));

import './polyfills';



