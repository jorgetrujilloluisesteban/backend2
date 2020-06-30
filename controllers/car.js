'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Car = require('../models/car');

var controller = {
    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Framework',
            autor: 'Esteban Luis',
            url: 'esteban.es',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos'
        });
    },

    //:id/:productoid/:cantidad';
    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        var car = new Car();
        // Asignar valores
        car.idcarrito = params.carro;
        car.idproducto = params.productoid;
        car.cantidad = params.cantidad;
        car.fecharegistro = params.fecha;
        /*
            "_id" : ObjectId("5eeb46606b470d67b8166225"),
            "idcarrito" : "1",
            "idproducto" : "5e42c2b7710f0f41d00deac2",
            "cantidad" : 1,
            "fecharegistro" : "18/06/2020"
        */
        // Guardar el articulo
        car.save((err, carStored) => {
            if (err || !carStored) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El carrito no se ha guardado'
                });
            }
            // Devolver una respuestas

            return res.status(200).send({
                message: 'Validación correcta',
                status: 'success',
                car: carStored
            });
        });

    },

    getCars: (req, res) => {

        var query = Car.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(2);
        }

        // Find
        query.sort('-_id').exec((err, cars) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los carros !!!'
                });
            }

            if (!cars) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay carros para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                cars
            });

        });

    },

    getCar: (req, res) => {

        // Recoger el id de la url
        var carId = req.params.id;

        // Comprobar que existe
        if (!carId || carId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el car !!!'
            });
        }
        // Buscar el carro
        Car.find({ idcarrito: carId }, (err, car) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los datos !!!'
                });
            }

            if (!car) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el carro !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                car
            });
        });

    },

    update: (req, res) => {

        // Recoger el id del articulo por la url
        var carId = req.params.id

        // Recoger los datos que llegan por put
        var params = req.body;

        /*
            "_id" : ObjectId("5eeb46606b470d67b8166225"),
            "idcarrito" : "1",
            "idproducto" : "5e42c2b7710f0f41d00deac2",
            "cantidad" : 1,
            "fecharegistro" : "18/06/2020"
        */

        // Validar datos
        try {
            var validate_idcarrito = !validator.isEmpty(params.idcarrito);
            var validate_idproducto = !validator.isEmpty(params.idproducto);
            var validate_cantidad = !validator.isEmpty(params.cantidad);
            var validate_fecharegistro = !validator.isEmpty(params.fecharegistro);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_idcarrito && validate_idproducto && validate_cantidad && validate_fecharegistro) {
            // Find and update
            Car.findByIdAndUpdate({ idcarrito: carId }, params, { new: true }, (err, carUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if (!carUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el carro !!!'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    car: carUpdated
                });

            });
        } else {
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'la validación no es correcta !!!'
            });
        }


    },

    delete: (req, res) => {
        //Recoger el id de la url
        //idcar + idpro
        var carId = req.params.idcar;
        //var carId = req.params.idpro;
        console.log("new producto id = ", carId);

        //Find and delete
        Car.findByIdAndDelete({ _id: carId }, (err, carRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if (!carRemoved) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se ha borrado el carro, posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                car: carRemoved
            });

        });
    },

    search3: (req, res) => {
        // Sacar el string a buscar
        var idcar = req.params.search;

        /*
            "_id" : ObjectId("5eeb46606b470d67b8166225"),
            "idcarrito" : "1",
            "idproducto" : "5e42c2b7710f0f41d00deac2",
            "cantidad" : 1,
            "fecharegistro" : "18/06/2020"
            http://gpd.sip.ucm.es/rafa/docencia/nosql/crud.html#find%20en%20detalle-Operadores-$exists
        */

        // Find or
        Car.find({ "idcarrito": { "$regex": idcar, "$options": "i" } })
            //{ "descripcion": { "$regex": searchString, "$options": "i"}}
            .exec((err, car) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición !!!'
                    });
                }

                if (!car || car.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay carro que coincida en tu búsqueda!!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    car
                });
            });

    }

}; // end controller

module.exports = controller;