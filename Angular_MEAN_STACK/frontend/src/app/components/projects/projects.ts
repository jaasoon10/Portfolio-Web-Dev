import { Component, OnInit, signal } from '@angular/core'; // Importa el nucli d'Angular i Signals
import { RouterLink } from '@angular/router'; // Importa l'enllaç de rutes
import { ProjectService } from '../../services/project.service'; // Importa el servei de projectes
import { Project } from '../../models/project'; // Importa el model de projecte
import { Global } from '../../services/global'; // Importa la configuració global
import { CommonModule } from '@angular/common'; // Importa el mòdul comú

@Component({
  selector: 'app-projects', // Seleccionador del component
  imports: [CommonModule, RouterLink], // Mòduls necessaris
  templateUrl: './projects.html', // Plantilla HTML
  styleUrl: './projects.css', // Estils CSS
  providers: [ProjectService] // Servei que proveeix les dades
})
export class Projects implements OnInit { // Classe del component de llistat
  public projects = signal<Project[]>([]); // Signal per emmagatzemar la llista de projectes
  public url: string; // URL base de l'API

  constructor(
    private _projectService: ProjectService // Injecta el servei de projectes
  ) {
    this.url = Global.url; // Assigna la URL des de Global
  }

  ngOnInit() { // S'executa en carregar el component
    this.getProjects(); // Crida al mètode per obtenir projectes
  }

  getProjects() { // Obté els projectes del servidor
    console.log("Solicitant projectes al servidor..."); 
    this._projectService.getProjects().subscribe({ // Subscripció a l'observable del servei
        next: (response) => { // Si la resposta és correcta
            console.log("Resposta rebuda:", response);
            if (response.projects) {
                this.projects.set(response.projects); // Actualitza el Signal amb els projectes rebuts
                console.log("Signal actualitzat amb", response.projects.length, "projectes.");
            }
        },
        error: (error) => { // Si hi ha un error
            console.log(<any>error);
        }
    });
  }
}
