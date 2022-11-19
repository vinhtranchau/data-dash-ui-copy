import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as LogRocket from 'logrocket';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  if (environment.logRocket) {
    LogRocket.init(environment.logRocket, {
      network: {
        requestSanitizer: (request) => {
          // if the url contains 'user'
          if (request.url.toLowerCase().indexOf('user') !== -1) {
            // scrub out the body
            request.body = '';
          }

          // make sure you return the modified request
          return request;
        },
      },
    });
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
