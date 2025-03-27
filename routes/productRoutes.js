// src/routes/productRoutes.js
const express = require('express');
const productoController = require('../controllers/productoController');
const authenticateJWT = require('../middleware/auth'); // Middleware de autenticación
const router = express.Router();

// Obtener todos los productos
router.get('/', productoController.getAllProducts);

// Crear un nuevo producto
router.post('/', authenticateJWT, productoController.createProduct);

// Actualizar un producto
router.put('/:id', authenticateJWT, productoController.updateProduct);

// Eliminar un producto
router.delete('/:id', authenticateJWT, productoController.deleteProduct);

// Buscar productos por nombre o código
router.get('/search', productoController.searchProducts);

// Buscar producto por código de barras
router.get('/codigo/:codigo', productoController.getProductByBarcode);

// Obtener el último código escaneado
router.get('/ultimo-codigo', authenticateJWT, productoController.getLastScannedCode);


module.exports = router;
