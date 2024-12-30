// src/routes/salaProductoRoutes.js
const express = require('express');
const salaProductoController = require('../controllers/salaProductoController');
const router = express.Router();

// Obtener todos los productos en una sala
router.get('/:id_sala', salaProductoController.getProductsBySalaId);

// Crear una relación sala-producto
router.post('/', salaProductoController.createSalaProducto);

// Actualizar cantidad de un producto en una sala
router.put('/:id', salaProductoController.updateSalaProducto);

// Eliminar una relación sala-producto
router.delete('/:id', salaProductoController.deleteSalaProducto);

//Buscar productos en una sala
router.get('/:id_sala/search', salaProductoController.searchSalaProductos);

//Obtener el valor total de entradas por mes
router.get('/:id_sala/valor-x-mes', salaProductoController.getValorTotalEntradasPorMes);

module.exports = router;
