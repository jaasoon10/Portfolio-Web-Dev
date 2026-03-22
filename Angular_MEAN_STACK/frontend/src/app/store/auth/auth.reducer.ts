import { createReducer, on } from '@ngrx/store'; // Eines de NgRx per als reductors
import * as AuthActions from './auth.actions'; // Importació de les accions d'autenticació

// Interfície que defineix l'estructura del nostre estat d'Auth
export interface AuthState {
  user: any | null; // L'usuari loguejat o null si no n'hi ha
}

// Estat inicial de l'aplicació en carregar pel primer cop (buit)
export const initialState: AuthState = {
  user: null
};

// El Reductor gestiona com canvia l'estat segons les accions
export const authReducer = createReducer(
  initialState,
  
  // Quan es dispara Login: actualitza el node 'user' amb les dades rebudes
  on(AuthActions.login, (state, { user }) => ({
    ...state, // Manté la resta de l'estat (si n'hi hagués més)
    user: user // Sobreescriu l'usuari amb el nou valor
  })),

  // Quan es dispara Logout: neteja el node 'user' posant-lo a null
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null // Esborra la sessió de la memòria
  }))
);
