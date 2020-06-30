'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    precio: Number,
    descripcion: String,
    imageurl: String
});

module.exports = mongoose.model('Producto', ProductoSchema);
