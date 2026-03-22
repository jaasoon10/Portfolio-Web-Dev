import { Routes } from '@angular/router'; // Importa la interfície Routes d'Angular

// Importació de tots els components de l'aplicació
import { About } from './components/about/about'; // Component de presentació
import { Projects } from './components/projects/projects'; // Component de llistat de projectes
import { Create } from './components/create/create'; // Component de creació
import { Edit } from './components/edit/edit'; // Component d'edició
import { Contact } from './components/contact/contact'; // Component de contacte
import { Detail } from './components/detail/detail'; // Component de detall del projecte
import { Login } from './components/login/login'; // Component d'identificació d'usuari
import { authGuard } from './guards/auth.guard'; // Guard de protecció per rutes privades
import { Error } from './components/error/error'; // Component de pàgina no trobada (404)

// Definició de les rutes de l'aplicació
export const routes: Routes = [
  { path: '', component: About },                // Ruta arrel, apunta a Sobre Nosaltres
  { path: 'about', component: About },           // Ruta alternativa per a Sobre Nosaltres
  { path: 'projects', component: Projects },     // Ruta al llistat general de projectes
  { path: 'create-project', component: Create, canActivate: [authGuard] }, // Ruta de creació protegida pel Guard
  { path: 'contact', component: Contact },       // Ruta al formulari de contacte
  { path: 'detall/:id', component: Detail },     // Ruta al detall rep un paràmetre ID per la URL
  { path: 'editar/:id', component: Edit, canActivate: [authGuard] },     // Ruta d'edició protegida amb paràmetre ID
  { path: 'login', component: Login },         // Ruta al formulari d'identificació
  { path: '**', component: Error }               // Ruta comodí per a qualsevol error 404
];
