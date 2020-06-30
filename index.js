'use strict'

var mongoose = require('mongoose');

var app = require('./app');
var port = 3900;


/* nuestra bd es shop */
mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/shop', { useNewUrlParser: true })
    .then(() => {
        console.log('La conexión a la base de datos se ha realizado!!!');
        //Crear servidor y ponerme a escuchar peticiones HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:' + port)
        });
    });

