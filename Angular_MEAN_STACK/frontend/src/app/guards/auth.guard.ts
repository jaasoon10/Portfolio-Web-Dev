import { inject } from '@angular/core'; // Eina per injectar serveis en funcions
import { CanActivateFn, Router } from '@angular/router'; // Tipus per a guàrdies de ruta i navegació
import { Store } from '@ngrx/store'; // Accés al magatzem NgRx
import { map, take } from 'rxjs'; // Operadors per gestionar el flux de dades

export const authGuard: CanActivateFn = (route, state) => { // Definició de la guàrdia
  const router = inject(Router); // Injecta el servei de rutes
  const store = inject(Store); // Injecta el magatzem d'estat

  // Consulta l'estat d'autenticació a l'Store
  return store.select((state: any) => state.auth.user).pipe(
    take(1), // Agafa només el primer valor i tanca la subscripció
    map(user => {
      if (user) {
        // Si l'usuari existeix a l'estat global, permet el pas a la ruta
        return true;
      } else {
        // Si no hi ha usuari, bloqueja i redirigeix a la pàgina de login
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
