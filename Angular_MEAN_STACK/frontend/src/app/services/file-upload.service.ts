import { Injectable } from '@angular/core'; // Injecció de dependències
import { HttpClient } from '@angular/common/http'; // Client HTTP per a peticions
import { Observable } from 'rxjs'; // Gestió asíncrona
import { Global } from './global'; // Accés a la URL base

@Injectable({
  providedIn: 'root' // Disponible a tota l'aplicació
})
export class FileUploadService { // Classe del servei de pujada
  baseApiUrl = Global.url + "upload-image/"; // Ruta del backend per a imatges

  constructor(private http: HttpClient) { } // Injecta el client HTTP

  upload(file: File, projectId: string): Observable<any> { // Puja un fitxer associat a un ID
    const formData = new FormData(); // Crea un formulari multipart
    formData.append("image", file, file.name); // Afegeix el fitxer amb la clau 'image'
    return this.http.post(this.baseApiUrl + projectId, formData); // Post al backend amb ID
  }
}
