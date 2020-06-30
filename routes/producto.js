'use strict'

var express = require('express');
var ProductoController = require('../controllers/producto');
var CarController = require('../controllers/car');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/productos'});

//Rutas de pruebas
router.post('/datos-curso', ProductoController.datosCurso);
router.get('/test-de-controlador', ProductoController.test);

//Rutas útiles
router.post('/save', ProductoController.save);
//router.get('/productos', ProductoController.getProductos);
router.get('/productos/:last?', ProductoController.getProductos);
router.get('/producto/:id', ProductoController.getProducto);
router.put('/producto/:id', ProductoController.update);
router.delete('/producto/:id', ProductoController.delete);
router.post('/upload-image/:id', md_upload, ProductoController.upload);
router.get('/get-image/:image', ProductoController.getImage);
router.get('/search/:search', ProductoController.search);

//Rutas vueshop2
router.get('/search2/:search', ProductoController.search2);

module.exports = router;
