import { Component, OnInit, signal } from '@angular/core'; // Importa el nucli d'Angular i Signals
import { CommonModule } from '@angular/common'; // Importa directrius comunes
import { Project } from '../../models/project'; // Importa el model de dades
import { ProjectService } from '../../services/project.service'; // Importa el servei de projectes
import { UserService } from '../../services/user.service'; // Importa el servei d'usuaris
import { Global } from '../../services/global'; // Importa configuració global
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // Eines per a rutes
import { Store } from '@ngrx/store'; // Importa NgRx Store

@Component({
  selector: 'app-detail', // Seleccionador del component
  standalone: true, // Indica que és autònom
  imports: [CommonModule, RouterLink], // Mòduls importats
  templateUrl: './detail.html', // Plantilla de vista
  styleUrls: ['./detail.css'], // Estils CSS
  providers: [ProjectService, UserService] // Serveis proveïdors
})
export class Detail implements OnInit { // Classe del component de detall
  public url: string; // URL base de l'API
  public project = signal<Project | null>(null); // Signal per a les dades del projecte
  public confirm: boolean = false; // Estat per a la confirmació d'esborrat
  public identity: any; // Identitat de l'usuari des del Store

  constructor(
    private _projectService: ProjectService, // Injecta el servei de projectes
    private _userService: UserService, // Injecta el servei d'usuaris
    private _router: Router, // Injecta l'encaminador per a navegació
    private _route: ActivatedRoute, // Injecta eina per llegir paràmetres URL
    private _store: Store // Injecta el magatzem d'estat NgRx
  ) {
    this.url = Global.url; // Inicialitza la URL de l'API
  }

  ngOnInit() { // Mètode d'inicialització
    // Subscripció a l'estat d'usuari de l'Store
    this._store.select((state: any) => state.auth.user).subscribe(user => {
        this.identity = user;
    });
    // Obté l'ID del projecte des dels paràmetres de la URL
    this._route.params.subscribe(params => {
      let id = params['id'];
      this.getProject(id); // Crida a obtenir dades del servidor
    });
  }

  getProject(id: string) { // Obté dades d'un projecte específic
    this._projectService.getProject(id).subscribe({
      next: (response) => {
        if (response.project) {
          this.project.set(response.project); // Assigna dades al Signal
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  setConfirm(value: boolean) { // Activa/Desactiva diàleg de confirmació
    this.confirm = value;
  }

  deleteProject(id: string) { // Elimina el projecte mitjançant el servei
    this._projectService.deleteProject(id).subscribe({
      next: (response) => {
        if (response.project) {
          this._router.navigate(['/projects']); // Redirigeix al llistat en acabar
        }
      },
      error: (error) => { console.log(error); }
    });
  }
}
