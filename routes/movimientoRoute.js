// src/routes/movimientoRoutes.js
const express = require('express');
const  authenticateJWT  = require("../middleware/auth");
const movimientoController = require('../controllers/movimientoController');
const router = express.Router();

router.get('/', authenticateJWT, movimientoController.getAllMovimientos);
router.post('/', authenticateJWT, movimientoController.createMovimiento);
router.get('/:id', authenticateJWT, movimientoController.getMovimientoById);
router.put('/:id', authenticateJWT, movimientoController.updateMovimiento);
router.delete('/:id', authenticateJWT, movimientoController.deleteMovimiento);
router.post('/entrada-barcode', authenticateJWT, movimientoController.registerEntryByBarcode);
router.post('/salida-barcode', authenticateJWT, movimientoController.registerExitByBarcode);
//reportes 
router.get('/reporte/movimiento-producto', authenticateJWT, movimientoController.getMovedProducts);
router.get('/reporte/productos-sin-salidas', authenticateJWT, movimientoController.getWithOutOutputProducts);
router.get('/reporte/historial-producto',authenticateJWT,movimientoController.getHistoryProduct);
router.get('/reporte/valor-entradas',authenticateJWT,movimientoController.getCostInputs);
router.get('/reporte/grafico-entradas-salas',authenticateJWT,movimientoController.getChartEntradasSalas);
router.get('/reporte/grafico-salidas-salas',authenticateJWT,movimientoController.getChartSalidasSalas);


module.exports = router;
