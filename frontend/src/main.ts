import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { InitService } from './app/core/services/init.service';
import { lastValueFrom } from 'rxjs';

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
