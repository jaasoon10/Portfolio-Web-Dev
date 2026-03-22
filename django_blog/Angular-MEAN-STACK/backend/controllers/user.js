'use strict'
var User = require('../models/user');

var controller = {
    // Mètode per guardar un usuari (per a proves)
    saveUser: function(req, res){
        var user = new User();
        var params = req.body;

        if (params.name && params.surname && params.email && params.password) {
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email;
            user.password = params.password; 
            user.role = 'ROLE_ADMIN';

            user.save().then((userStored) => {
                if(!userStored) return res.status(404).send({message: 'No s\'ha pogut desar l\'usuari.'});
                return res.status(200).send({user: userStored});
            }).catch((err) => {
                return res.status(500).send({message: 'Error al desar l\'usuari.'});
            });
        } else {
            return res.status(200).send({message: 'Envia totes les dades necessàries.'});
        }
    },

    // Mètode Login
    login: function(req, res){
        var params = req.body;
        var email = params.email;
        var password = params.password;

        User.findOne({email: email, password: password}).then((user) => {
            if(user){
                // Usuari trobat
                return res.status(200).send({
                    user: user
                });
            } else {
                // Usuari no trobat
                return res.status(404).send({message: 'L\'usuari no existeix o la contrasenya és incorrecta.'});
            }
        }).catch((err) => {
            return res.status(500).send({message: 'Error en la petició.'});
        });
    }
};

module.exports = controller;
