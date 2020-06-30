'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Producto = require('../models/producto');

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

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_nombre = !validator.isEmpty(params.nombre);
            var validate_precio = !validator.isEmpty(params.precio);
            var validate_descripcion = !validator.isEmpty(params.descripcion);
            var validate_imageurl = !validator.isEmpty(params.imageurl);

        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar!!!'
            });
        }

        if (validate_nombre && validate_precio && validate_descripcion && validate_imageurl) {

            // Crear el objeto a guardar
            var producto = new Producto();

            // Asignar valores
            producto.nombre = params.nombre;
            producto.precio = params.precio;
            producto.descripcion = params.descripcion;
            producto.imageurl = params.imageurl;
            /*
                "_id" : ObjectId("5e42c2b7710f0f41d00deac2"),
                "nombre" : "libro1",
                "precio" : "20",
                "descripcion" : "Este es el libro1",
                "imageurl" : "0001"
            */
            // Guardar el articulo
            producto.save((err, productoStored) => {
                if (err || !productoStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El producto no se ha guardado'
                    });
                }
                // Devolver una respuestas

                return res.status(200).send({
                    message: 'Validación correcta',
                    status: 'success',
                    producto: productoStored
                });
            });


        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },

    getProductos: (req, res) => {

        var query = Producto.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(2);
        }

        // Find
        query.sort('-_id').exec((err, productos) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los productos !!!'
                });
            }

            if (!productos) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay productos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                productos
            });

        });

    },

    getProducto: (req, res) => {

        // Recoger el id de la url
        var productoId = req.params.id;

        // Comprobar que existe
        if (!productoId || productoId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el producto !!!'
            });
        }
        // Buscar el articulo
        Producto.findById(productoId, (err, producto) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los datos !!!'
                });
            }

            if (!producto) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el producto !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                producto
            });
        });

    },

    update: (req, res) => {

        // Recoger el id del articulo por la url
        var productoId = req.params.id

        // Recoger los datos que llegan por put
        var params = req.body;

        /*
            "_id" : ObjectId("5e42c2b7710f0f41d00deac2"),
            "nombre" : "libro1",
            "precio" : "20",
            "descripcion" : "Este es el libro1",
            "imageurl" : "0001"
        */

        // Validar datos
        try {
            var validate_nombre = !validator.isEmpty(params.nombre);
            var validate_precio = !validator.isEmpty(params.precio);
            var validate_descripcion = !validator.isEmpty(params.descripcion);
            var validate_imageurl = !validator.isEmpty(params.imageurl);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_nombre && validate_precio && validate_descripcion && validate_imageurl) {
            // Find and update
            Producto.findByIdAndUpdate({ _id: productoId }, params, { new: true }, (err, productoUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if (!productoUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el producto !!!'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    producto: productoUpdated
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
        var productoId = req.params.id;

        //Find and delete
        Producto.findByIdAndDelete({ _id: productoId }, (err, productoRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if (!productoRemoved) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se ha borrado el producto, posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                producto: productoRemoved
            });

        });
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            })
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * PARA LINUX O MAC
        // var file_split = file_path.split('/')

        //Nombre del archivo
        var file_name = file_split[2];

        //Extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extensión, solo imagenes, is es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });

        } else {
            // Si todo es valido, sacando id de la url
            var productoId = req.params.id;

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Producto.findOneAndUpdate({ _id: productoId }, { image: file_name }, { new: true }, (err, productoUpdated) => {

                if (err || !productoUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de producto !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    producto: productoUpdated
                })

            });
        }

    }, // end upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = 'upload/productos/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                })
            }
        });

    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        /*
            "_id" : ObjectId("5e42c2b7710f0f41d00deac2"),
            "nombre" : "libro1",
            "precio" : "20",
            "descripcion" : "Este es el libro1",
            "imageurl" : "0001"
        */

        // Find or
        Producto.find({
            "$or": [
                { "nombre": { "$regex": searchString, "$options": "i" } },
                { "descripcion": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, productos) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición !!!'
                    });
                }

                if (!productos || productos.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay productos que coincida en tu búsqueda!!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    productos
                });
            });

    },
    search2: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        /*
            "_id" : ObjectId("5e42c2b7710f0f41d00deac2"),
            "nombre" : "libro1",
            "precio" : "20",
            "descripcion" : "Este es el libro1",
            "imageurl" : "0001"
            http://gpd.sip.ucm.es/rafa/docencia/nosql/crud.html#find%20en%20detalle-Operadores-$exists
        */

        // Find or
        Producto.find({ "nombre": { "$regex": searchString, "$options": "i" } })
            .exec((err, productos) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición !!!'
                    });
                }

                if (!productos || productos.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay productos 2 que coincida en tu búsqueda!!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    productos
                });
            });

    }

}; // end controller

module.exports = controller;