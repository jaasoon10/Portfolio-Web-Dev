import { createAction, props } from '@ngrx/store'; // Eines de NgRx per definir accions

// Acció quan l'usuari s'identifica amb èxit al servidor
export const login = createAction(
  '[Auth] Login', // Identificador únic de l'acció
  props<{ user: any }>() // Dades adjuntes (l'objecte usuari)
);

// Acció quan l'usuari decideix marxar i tancar la sessió
export const logout = createAction('[Auth] Logout'); // Acció simple sense dades
