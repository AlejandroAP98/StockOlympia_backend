// src/routes/productRoutes.js
const express = require('express');
const productoController = require('../controllers/productoController');
const authenticateJWT = require('../middleware/auth'); // Asegúrate de importar el middleware de autenticación
const router = express.Router();

// Obtener todos los productos
router.get('/', productoController.getAllProducts);

// Crear un nuevo producto
router.post('/', authenticateJWT, productoController.createProduct);

// Actualizar un producto
router.put('/:id', productoController.updateProduct);

// Eliminar un producto
router.delete('/:id', productoController.deleteProduct);

//Buscar un producto
router.get('/search', productoController.searchProducts);

module.exports = router;

