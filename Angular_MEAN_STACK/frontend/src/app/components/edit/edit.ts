import { Component, OnInit } from '@angular/core'; // Importa el nucli d'Angular
import { CommonModule } from '@angular/common'; // Importa mòdul comú
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Eines per a formularis
import { ProjectService } from '../../services/project.service'; // Servei de projectes
import { FileUploadService } from '../../services/file-upload.service'; // Servei de fitxers
import { Project } from '../../models/project'; // Model de dades
import { Global } from '../../services/global'; // Configuració global
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // Eines de navegació

@Component({
  selector: 'app-edit', // Seleccionador del component
  standalone: true, // Component autònom
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Importacions
  templateUrl: './edit.html', // Vista HTML
  styleUrl: '../create/create.css', // Reutilitza estils de creació
  providers: [ProjectService, FileUploadService] // Proveïdors
})
export class Edit implements OnInit { // Classe del component d'edició
  public title: string = "Editar Projecte"; // Títol de la pàgina
  public projectForm!: FormGroup; // Grup de formulari
  public status: string = ""; // Estat del procés
  public file: File | null = null; // Fitxer seleccionat
  public loading: boolean = false; // Control de càrrega
  public url: string; // URL de l'API
  public project!: Project; // Projecte existent
  public save_project!: Project; // Projecte actualitzat
  public fileError: string = ""; // Error de format de fitxer

  constructor(
    private _fb: FormBuilder, // Constructor de formularis
    private _projectService: ProjectService, // Servei de dades
    private _fileUploadService: FileUploadService, // Servei de fitxers
    private _router: Router, // Navegació
    private _route: ActivatedRoute // Gestió de rutes
  ) {
    this.url = Global.url; // Assigna la URL API
  }

  ngOnInit(): void { // En carregar el component
    this._route.params.subscribe(params => { // Recull paràmetres URL
        let id = params['id'];
        this.getProject(id); // Obté el dades del projecte per ID
    });
    this.initForm(); // Inicialitza camps del form
  }

  initForm() { // Constructor inicial del formulari
    this.projectForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      year: [2026],
      langs: ['', Validators.required],
      image: ['']
    });
  }

  getProject(id: string) { // Crida al servidor pel projecte
    this._projectService.getProject(id).subscribe({
        next: (response) => {
            if (response.project) {
                this.project = response.project;
                // Emplena el formulari amb dades existents
                this.projectForm.patchValue({
                    name: this.project.name,
                    description: this.project.description,
                    category: this.project.category,
                    year: this.project.year,
                    langs: this.project.langs
                });
            }
        },
        error: (error) => { console.log(error); }
    });
  }

  onSubmit() { // En clicar Enviar Canvis
    if (this.projectForm.valid) {
        // Actualitza l'objecte local amb el form
        this.project.name = this.projectForm.value.name;
        this.project.description = this.projectForm.value.description;
        this.project.category = this.projectForm.value.category;
        this.project.year = this.projectForm.value.year;
        this.project.langs = this.projectForm.value.langs;

        this._projectService.updateProject(this.project).subscribe({ // Crida PUT al server
            next: (response) => {
                if (response.project) {
                    if (this.file) { // Si hi ha nova imatge
                        this.loading = true;
                        this._fileUploadService.upload(this.file, response.project._id).subscribe({
                            next: (event: any) => {
                                this.save_project = event.project;
                                this.status = 'success';
                                this.loading = false;
                            },
                            error: (error) => { this.status = 'failed'; this.loading = false; }
                        });
                    } else { // Si no canviem la imatge
                        this.save_project = response.project;
                        this.status = 'success';
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Puja a dalt
                } else { this.status = 'failed'; }
            },
            error: (error) => { this.status = 'failed'; }
        });
    }
  }

  onChange(event: any) { // Selecció de fitxer
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) { // Només imatges
        this.file = file;
        this.fileError = "";
      } else { // Format incorrecte
        this.file = null;
        this.fileError = "Només es permeten imatges (JPG, PNG, GIF, etc.)";
        event.target.value = '';
      }
    }
  }
}
