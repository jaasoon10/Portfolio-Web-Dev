import { Injectable } from '@angular/core'; // Permet injectar el servei a qualsevol component
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Eines per a comunicació HTTP
import { Observable } from 'rxjs'; // Per gestionar respostes asíncrones
import { Project } from '../models/project'; // Model de dades de projecte
import { Global } from './global'; // Configuració global (URL)

@Injectable({
  providedIn: 'root' // Disponible a tota l'aplicació
})
export class ProjectService { // Classe del servei de projectes
  public url: string; // Propietat per la URL de l'API

  constructor(
    private _http: HttpClient // Injecta el client HTTP d'Angular
  ){
    this.url = Global.url; // Inicialitza amb la URL global
  }

  testService() { // Mètode de prova bàsica
    return "Provant el servei";
  }

  saveProject(project: Project): Observable<any> { // Desa un projecte nou (POST)
    let params = JSON.stringify(project); // Converteix dades a format JSON
    let headers = new HttpHeaders().set('Content-Type', 'application/json'); // Capçaleas JSON
    return this._http.post(this.url + 'save-project', params, { headers: headers }); // Petició al server
  }

  getProjects(): Observable<any> { // Obté tots els projectes (GET)
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'projects', { headers: headers }); // Petició al server
  }

  getProject(id: string): Observable<any> { // Obté un projecte per ID (GET)
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'project/' + id, { headers: headers }); // Consulta específica
  }

  deleteProject(id: string): Observable<any> { // Elimina un projecte (DELETE)
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete(this.url + 'project/' + id, { headers: headers }); // Ordre d'eliminació
  }

  updateProject(project: Project): Observable<any> { // Actualitza un projecte (PUT)
    let params = JSON.stringify(project); // Nou JSON amb canvis
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.put(this.url + 'project/' + project._id, params, { headers: headers }); // Modificació
  }
}
