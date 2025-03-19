// src/routes/movimientoRoutes.js
const express = require('express');
const movimientoController = require('../controllers/movimientoController');
const router = express.Router();

router.get('/', movimientoController.getAllMovimientos);
router.post('/', movimientoController.createMovimiento);
router.get('/:id', movimientoController.getMovimientoById);
router.put('/:id', movimientoController.updateMovimiento);
router.delete('/:id', movimientoController.deleteMovimiento);
router.post('/entrada-barcode', movimientoController.registerEntryByBarcode);
router.post('/salida-barcode', movimientoController.registerExitByBarcode);
//reportes 
router.get('/reporte/movimiento-producto', movimientoController.getMovedProducts);
router.get('/reporte/productos-sin-salidas', movimientoController.getWithOutOutputProducts);
router.get('/reporte/historial-producto',movimientoController.getHistoryProduct);
router.get('/reporte/valor-entradas',movimientoController.getCostInputs);
router.get('/reporte/grafico-entradas-salas',movimientoController.getChartEntradasSalas);
router.get('/reporte/grafico-salidas-salas',movimientoController.getChartSalidasSalas);


module.exports = router;
