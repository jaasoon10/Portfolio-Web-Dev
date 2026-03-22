import { Injectable } from '@angular/core'; // Permet la injecció de dependències
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Eines per a peticions HTTP
import { Observable } from 'rxjs'; // Gestió de respostes asíncrones
import { Global } from './global'; // Accés a la URL del backend

@Injectable({
  providedIn: 'root' // Servei disponible globalment
})
export class UserService { // Classe pel servei d'usuaris
  public url: string; // URL de l'API

  constructor(
    private _http: HttpClient // Injecta el client HTTP
  ) {
    this.url = Global.url; // Assigna la URL API des de Global
  }

  login(user: any): Observable<any> { // Realitza l'intent de login (POST)
    let params = JSON.stringify(user); // Converteix dades d'usuari a JSON
    let headers = new HttpHeaders().set('Content-Type', 'application/json'); // Capçaleas JSON
    return this._http.post(this.url + 'login', params, { headers: headers }); // Petició al servidor
  }
}
