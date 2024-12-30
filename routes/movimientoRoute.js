// src/routes/movimientoRoutes.js
const express = require('express');
const movimientoController = require('../controllers/movimientoController');
const router = express.Router();

router.get('/', movimientoController.getAllMovimientos);
router.post('/', movimientoController.createMovimiento);
router.get('/:id', movimientoController.getMovimientoById);
router.put('/:id', movimientoController.updateMovimiento);
router.delete('/:id', movimientoController.deleteMovimiento);
router.get('/reporte/movimiento-producto', movimientoController.getMovedProducts);
router.get('/reporte/productos-sin-salidas', movimientoController.getWithOutOutputProducts);
router.get('/reporte/historial-producto',movimientoController.getHistoryProduct);
router.get('/reporte/valor-entradas',movimientoController.getCostInputs);


module.exports = router;
