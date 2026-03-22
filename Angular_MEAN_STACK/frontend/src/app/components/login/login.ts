import { Component, OnInit } from '@angular/core'; // Importa el nucli d'Angular
import { CommonModule } from '@angular/common'; // Importa mòdul comú
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Eines per a formularis
import { UserService } from '../../services/user.service'; // Servei d'usuaris
import { Router } from '@angular/router'; // Eina de navegació
import { Store } from '@ngrx/store'; // Magatzem d'estat NgRx
import * as AuthActions from '../../store/auth/auth.actions'; // Accions d'autenticació

@Component({
  selector: 'app-login', // Seleccionador del component
  standalone: true, // Component autònom
  imports: [CommonModule, ReactiveFormsModule], // Mòduls importats
  templateUrl: './login.html', // Vista HTML
  styleUrl: './login.css', // Estils CSS
  providers: [UserService] // Proveïdor del servei d'usuaris
})
export class Login implements OnInit { // Classe del component d'identificació
  public loginForm!: FormGroup; // Grup de dades del formulari
  public status: string = ""; // Estat del login

  constructor(
    private _fb: FormBuilder, // Constructor de formularis reactius
    private _userService: UserService, // Injecta el servei d'usuaris
    private _router: Router, // Injecta l'encaminador
    private _store: Store // Injecta el Store de NgRx
  ) {}

  ngOnInit(): void { // Inicialització
    // Configura camps i validacions del formulari
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]], // Email obligatori i amb format
      password: ['', Validators.required] // Contrasenya obligatòria
    });
  }

  onSubmit() { // En clicar Entrar
    if (this.loginForm.valid) {
      // Crida al servei de login de l'API
      this._userService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.user) {
            this.status = "success";
            // Desa l'usuari a l'estat global de l'app mitjançant NgRx
            this._store.dispatch(AuthActions.login({ user: response.user }));
            // Redirigim a la pàgina principal després d'un segon
            setTimeout(() => {
                this._router.navigate(['/']); 
            }, 1000);
          } else { this.status = "error"; }
        },
        error: (error) => { this.status = "error"; }
      });
    }
  }
}
