'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3700;

//mongoose.set('useFindAndModify', false);
//mongoose.Promise = global.Promise;


mongoose.Promise = global.Promise;
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //     user: 'pmt',
    //     pass: '1234'
    //     //auth:{authdb:"admin"}

}

mongoose.connect('mongodb://localhost:27017/portfolio', options)
    .then(() => {
        console.log("Connexio a la BD establerta correctament ");

        // Creació del servidor
        app.listen(port, () => {
            console.log("Servidor funcionant correctament");
        });
    })
    .catch(err => console.log(err));


