// src/routes/salaRoutes.js
const express = require('express');
const salaController = require('../controllers/salaController');
const router = express.Router();

// Obtener todas las salas
router.get('/', salaController.getAllSalas);

// Crear una nueva sala
router.post('/', salaController.createSala);

// Obtener una sala específica
router.get('/:id', salaController.getSalaById);

// Actualizar una sala
router.put('/:id', salaController.updateSala);

// Eliminar una sala
router.delete('/:id', salaController.deleteSala);

module.exports = router;
