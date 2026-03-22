export class Project { // Definició de la classe Projecte
    constructor(
        public _id: string, // Identificador únic de la base de dades
        public name: string, // Nom del projecte
        public description: string, // Descripció de la feina realitzada
        public category: string, // Tipus de projecte (Web, Disseny, etc.)
        public year: number, // Any de creació
        public langs: string, // Llenguatges de programació fets servir
        public image: string // Nom de l'arxiu d'imatge desat
    ) {}
}
