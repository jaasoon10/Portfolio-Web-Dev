import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'; // Eines per a la configuració global de l'app
import { provideRouter } from '@angular/router'; // Proveïdor per configurar les rutes
import { provideHttpClient } from '@angular/common/http'; // Proveïdor per permetre peticions HTTP
import { provideStore } from '@ngrx/store'; // Proveïdor pel magatzem d'estat NgRx
import { authReducer } from './store/auth/auth.reducer'; // Reductor d'autenticació per a NgRx

import { routes } from './app.routes'; // Importa el fitxer amb la definició de les rutes

export const appConfig: ApplicationConfig = { // Objecte de configuració principal de l'aplicació
  providers: [
    provideBrowserGlobalErrorListeners(), // Habilita el control d'errors globals
    provideRouter(routes), // Injecta les rutes definides a app.routes
    provideHttpClient(), // Habilita el client HTTP per a tot el projecte
    provideStore({ auth: authReducer }) // Configura el Store central amb el reductor d'Auth
  ]
};
