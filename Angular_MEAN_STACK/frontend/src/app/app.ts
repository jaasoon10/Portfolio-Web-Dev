import { Component, signal, OnInit } from '@angular/core'; // Importa el nucli d'Angular
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Importa les eines de rutes
import { CommonModule } from '@angular/common'; // Importa directives comunes
import { UserService } from './services/user.service'; // Importa el servei d'usuaris
import { Router } from '@angular/router'; // Importa el servei de navegació
import { Store } from '@ngrx/store'; // Importa el Store de NgRx
import * as AuthActions from './store/auth/auth.actions'; // Importa les accions d'autenticació

@Component({
  selector: 'app-root', // Seleccionador del component
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule], // Mòduls importats
  templateUrl: './app.html', // Ruta a la plantilla HTML
  styleUrl: './app.css', // Ruta als estils CSS
  providers: [UserService] // Proveïdor del servei d'usuaris
})
export class App implements OnInit { // Classe principal del component
  public title = signal('cliente-angular'); // Títol de l'aplicació amb Signal
  public identity: any; // Variable per guardar la identitat de l'usuari

  constructor(
    private _userService: UserService, // Injecta el servei d'usuaris
    private _router: Router, // Injecta l'encaminador
    private _store: Store // Injecta el magatzem d'estat
  ) {}

  ngOnInit() { // Mètode que s'executa en iniciar el component
    // Escoltem els canvis de l'Store de NgRx de forma reactiva
    this._store.select((state: any) => state.auth.user).subscribe(user => { // Subscripció a l'estat d'usuari
      this.identity = user; // Actualitza la identitat amb el valor de l'Store
    });
  }

  logout() { // Mètode per tancar la sessió
    // DISPATCH de l'acció per netejar l'estat a la RAM
    this._store.dispatch(AuthActions.logout()); // Llança l'acció de tancar sessió
    this._router.navigate(['/']); // Navega a la pàgina d'inici
  }
}
