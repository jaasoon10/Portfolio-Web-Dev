const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connexió a la BD per inserir usuari d'admin...");

        const user = new User({
            name: 'Admin',
            surname: 'Angular',
            email: 'admin@admin.com',
            password: 'password123',
            role: 'ROLE_ADMIN'
        });

        User.find({ email: user.email }).then(users => {
            if (users.length > 0) {
                console.log("L'usuari ja existeix.");
                process.exit();
            } else {
                user.save().then(userStored => {
                    console.log("Usuari d'admin creat correctament:", userStored.email);
                    process.exit();
                }).catch(err => {
                    console.log("Error al crear l'usuari:", err);
                    process.exit();
                });
            }
        });
    })
    .catch(err => console.log(err));
