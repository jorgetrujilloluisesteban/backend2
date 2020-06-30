'use strict'

var express = require('express');
var CarController = require('../controllers/car');

var router = express.Router();

var multipart = require('connect-multiparty');

//Rutas útiles 2
router.post('/car/save', CarController.save);
router.get('/cars/:last?', CarController.getCars);
router.get('/carro/:id', CarController.getCar);
router.put('/car/update/:id', CarController.update);
router.delete('/carro/:idcar/:idpro', CarController.delete);
router.get('/car/search3/:search', CarController.search3);


module.exports = router;

