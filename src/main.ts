import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { ENV } from './environments/environment';
import { AppModule } from './app/app.module';

if (ENV.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
