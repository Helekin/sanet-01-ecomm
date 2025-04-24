import { bootstrapApplication } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { InitService } from './app/core/services/init.service';

bootstrapApplication(AppComponent, appConfig)
  .then(async (appRef) => {
    const initService = appRef.injector.get(InitService);

    try {
      return await lastValueFrom(initService.init());
    } finally {
      const splash = document.getElementById('initial-splash');
      if (splash) {
        splash.remove();
      }
    }
  })
  .catch((err) => console.error(err));
