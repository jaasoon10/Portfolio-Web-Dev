import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  // Definició de les 3 propietats segons la imatge
  public titol: string = "Projecte Angular v8";
  public subtitol: string = "uf3 M6 - Desenvolupant web entorn client";
  public email: string = "m6daw@lacetania.cat";

  constructor() {}
}
