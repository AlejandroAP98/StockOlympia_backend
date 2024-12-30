// src/routes/marcaRoutes.js
const express = require('express');
const marcaController = require('../controllers/marcaController');
const router = express.Router();

router.get('/', marcaController.getAllMarcas);
router.post('/', marcaController.createMarca);
router.get('/:id', marcaController.getMarcaById);
router.put('/:id', marcaController.updateMarca);
router.delete('/:id', marcaController.deleteMarca);

module.exports = router;
