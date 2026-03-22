'use strict'

var Project = require('../models/project');
var fs = require('fs');
var path = require('path');



var controller = {
    home: function( req, res) {

        return res.status(200).send({
            message: 'Pagina'
        });
    },

    test: function( req, res) {
        return res.status(200).send({
            message: 'Pagina de test'
        });
    },

    saveProject: function(req, res){
    
		var project = new Project();

		var params = req.body;
		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.year = params.year;
		project.langs = params.langs;
		project.image = "null";

/*		project.save((err, projectStored) => {
			if(err) {
				console.log(err);
				return res.status(500).send({message: 'Error al desar el document'});
			 }	

			if(!projectStored) return res.status(404).send({message: 'Document no desat'});

			return res.status(200).send({project: projectStored});
		});
*/		
		project.save().then((projectStored) => {
			if(!projectStored) return res.status(404).send({message: 'Document no desat'});
			return res.status(200).send({project: projectStored});
		}).catch((err) => {
				console.log(err);
				return res.status(500).send({message: 'Error al desar el document'});
		});		

	},
	
	getProject: function (req, res) {
		var projectId = req.params.id;
		console.log(projectId);



		if (projectId == null ) return res.status(500).send({message: 'no has especificat cap projecte '})
		
		else {

/*			Project.findById(projectId, (err,project) => {

				if(err) {
					console.log(err);
					return res.status(500).send({message: 'Error al retornar les dades'});
			 	}	

				if(!project) return res.status(404).send({message: 'El projecte no existeix'});

				return res.status(200).send({
					project
				});
			} );
*/			
			Project.findById(projectId).then((project) => {
				if(!project) return res.status(404).send({message: 'El projecte no existeix'});
				return res.status(200).send({
					project
				});
			}).catch((err) =>{
					console.log(err);
					return res.status(500).send({message: 'Error al retornar les dades'});			
			});

		} 
	},

	getProjects: function(req, res) {
/*		Project.find({}).exec((err, projects) => {
			if (err) return res.status(500).send({message: 'Error al retornar les dades'});
			if (!projects) return res.status(404).send({message: 'No hi ha projectes'});
			return res.status(200).send({
				projects
			});


	
		});
*/
		Project.find({}).then((projects) => {
			if (!projects) return res.status(404).send({message: 'No hi ha projectes'});
			return res.status(200).send({projects});
			}).catch((err) =>{
				return res.status(500).send({message: 'Error al retornar les dades'});
			});

	},

	updateProject: function (req,res) {
		// el valor de la id arriba per la URL
		var projectId = req.params.id;
		// les dades de l'objecte per body
		var update =req.body;

		// si entrem a la funció de callBack és que s'ha executat el mètode
		// new:true fa que retorni l'objecte nou (no l'antic

/*		Project.findByIdAndUpdate(projectId, update, {new:true} ,(err,projectUpdated) => {

			if (err) {
				//console.log(err);
				return res.status(500).send({message: 'Error actualitzant les dades'});
			}
			if (!projectUpdated) return res.status(404).send({message: 'No existeix el projecte'});
			return res.status(200).send({
				project: projectUpdated
			});

		})
*/
		Project.findByIdAndUpdate(projectId, update, {new:true}).then((projectUpdated) => {
			if (!projectUpdated) return res.status(404).send({message: 'No existeix el projecte'});
			return res.status(200).send({
				project: projectUpdated
			})
		}).catch((err) => {
			//console.log(err);
			return res.status(500).send({message: 'Error actualitzant les dades'});

		});		
	},
	deleteProject: function (req,res) {
		// el valor de la id arriba per la URL
		var projectId = req.params.id;
/*		Project.findByIdAndDelete(projectId, (err, projectRemoved) => {

			if (err) {
				//console.log(err);
				return res.status(500).send({message: 'Error: no s\'ha pogut borrar el projecte'});
			}
			if (!projectRemoved) return res.status(404).send({message: 'No existeix el projecte a borrar'});
			return res.status(200).send({
				project: projectRemoved
			})
		});
*/		
		Project.findByIdAndDelete(projectId).then((projectRemoved) => {
			if (!projectRemoved) return res.status(404).send({message: 'No existeix el projecte a borrar'});
			return res.status(200).send({
				project: projectRemoved
			})
		}).catch((err) => {
		  return res.status(500).send({message: 'Error: no s\'ha pogut borrar el projecte'});
		});
	},

	uploadImage2: function (req, res) {
	
	    console.log("UPLOAD IMAGE");

		var projectId = req.params.id;
		var fileName = "Imatge no pujada";

		if (req.files) {
			
			//project.js
			var filePath = req.files.image.path;
			// ON WINDOWS
			var fileSplit = filePath.split('\\');
			
			// ON LINUX
			//var fileSplit = filePath.split('/');

			var fileName = fileSplit[1];

			console.log(filePath);
			console.log(fileName);

			Project.findByIdAndUpdate(projectId, {image: fileName} , {new:true}).then((projectUpdated) => {
				if (!projectUpdated) return res.status(404).send({message: 'No existeix el projecte'});
				console.log(projectUpdated);
				return res.status(200).send({
					project: projectUpdated
				}); 
			}).catch((err) => {
			   return res.status(500).send({message: 'Error actualitzant la imatge'});
			});			
		} else {
			console.log("Imatge no parametres");
			return res.status(500).send({
				message: fileName
			})
		}
		
	},
	
	getImage: function (req, res) {
		var file = req.params.image;
		var path_file = './uploads/' +file;

		fs.exists(path_file, (exists) =>{
			if (exists) {
				return res.sendFile(path.resolve(path_file));
			}else{
				return res.status(200).send({
					message: "No hi ha la imatge"
				});

			}
		});


	}


};

module.exports = controller;
