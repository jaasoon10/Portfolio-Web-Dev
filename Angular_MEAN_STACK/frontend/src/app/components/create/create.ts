import { Component, OnInit } from '@angular/core'; // Importa el nucli d'Angular
import { CommonModule } from '@angular/common'; // Importa directives comunes
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Mòduls per a formularis reactius
import { ProjectService } from '../../services/project.service'; // Servei per la lògica de projectes
import { FileUploadService } from '../../services/file-upload.service'; // Servei per la pujada d'arxius
import { Project } from '../../models/project'; // Model de dades del projecte
import { RouterLink } from '@angular/router'; // Enllaços per a les rutes

@Component({
  selector: 'app-create', // Seleccionador del component
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Importacions de mòduls
  templateUrl: './create.html', // Plantilla de vista
  styleUrl: './create.css', // Estils locals
  providers: [ProjectService, FileUploadService] // Proveïdors de serveis
})
export class Create implements OnInit { // Classe del component de creació
  public title: string = "Crear Projecte"; // Títol de la pàgina
  public projectForm!: FormGroup; // Grup de camps del formulari
  public status: string = ""; // Estat de la petició (success/failed)
  public file: File | null = null; // Arxiu d'imatge seleccionat
  public loading: boolean = false; // Control de l'indicador de càrrega
  public save_project!: Project; // Referència al projecte desat
  public fileError: string = ""; // Error de validació d'arxiu

  constructor(
    private _fb: FormBuilder, // Inicialitza el constructor de formularis
    private _projectService: ProjectService, // Injecta el servei de projectes
    private _fileUploadService: FileUploadService // Injecta el servei de fitxers
  ) {}

  ngOnInit(): void { // S'executa en iniciar el component
    // Inicialitza el formulari amb regles de validació
    this.projectForm = this._fb.group({
      name: ['', Validators.required], // Nom obligatori
      description: ['', Validators.required], // Descripció obligatòria
      category: ['', Validators.required], // Categoria obligatòria
      year: [2026], // Any per defecte
      langs: ['', Validators.required], // Llenguatges obligatoris
      image: [''] // Camp per la imatge
    });
  }

  onSubmit() { // Mètode que s'executa en enviar el formulari
    if (this.projectForm.valid) { // Si el formulari és vàlid
      // Crea l'objecte per enviar a l'API
      const projectToSave = new Project(
          '',
          this.projectForm.value.name,
          this.projectForm.value.description,
          this.projectForm.value.category,
          this.projectForm.value.year,
          this.projectForm.value.langs,
          ''
      );

      // Crida al servei per desar el projecte
      this._projectService.saveProject(projectToSave).subscribe({
          next: (response) => { // RESPOSTA CORRECTA
              if (response.project) {
                  // Si hi ha arxiu l'intentem pujar
                  if (this.file) {
                    this.loading = true; // Activa spinner
                    this._fileUploadService.upload(this.file, response.project._id).subscribe({
                      next: (event: any) => { // IMATGE PUJADA
                        this.status = 'success';
                        this.loading = false;
                        this.save_project = event.project;
                        this.projectForm.reset(); // Reseteja formulari
                      },
                      error: (error) => { // ERROR PUJADA
                        this.status = 'failed';
                        this.loading = false;
                      }
                    });
                  } else { // SENSE IMATGE
                    this.status = 'success';
                    this.save_project = response.project;
                    this.projectForm.reset();
                  }
                  // Scroll automàtic cap amunt
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                  this.status = 'failed';
              }
          },
          error: (error) => { // ERROR SERVER
              this.status = 'failed';
          }
      });
    }
  }

  onChange(event: any) { // Selecció de fitxer
    const file = event.target.files[0]; // Agafa el fitxer
    if (file) {
      if (file.type.startsWith('image/')) { // Només imatges
        this.file = file;
        this.fileError = "";
      } else { // Error de format
        this.file = null;
        this.fileError = "Només es permeten imatges (JPG, PNG, GIF, etc.)";
        event.target.value = ''; // Neteja l'input
      }
    }
  }
}
