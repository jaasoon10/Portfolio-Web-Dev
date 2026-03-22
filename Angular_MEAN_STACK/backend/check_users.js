const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        User.find({}).then(users => {
            console.log("Usuaris a la BD:");
            users.forEach(u => {
                console.log(`Email: ${u.email}, Password: ${u.password}`);
            });
            process.exit();
        });
    })
    .catch(err => {
        console.log(err);
        process.exit();
    });
