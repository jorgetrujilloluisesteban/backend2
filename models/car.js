'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = Schema({
    idcarrito: String,
    idproducto: String,
    cantidad: Number,
    fecharegistro: String
});

module.exports = mongoose.model('Car', CarSchema);