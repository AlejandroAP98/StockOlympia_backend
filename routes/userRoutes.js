// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authorizeRole = require('../middleware/role');
const authenticateJWT = require('../middleware/auth'); // Middleware de autenticación
const router = express.Router();

// Obtener todos los usuarios (solo para administradores)
router.get('/', authenticateJWT, authorizeRole(1), userController.getAllUsers);

// Crear un nuevo usuario (solo para administradores)
router.post('/', authenticateJWT, authorizeRole(1), userController.createUser);

// Obtener información de un usuario específico
router.get('/:id', authenticateJWT, userController.getUserById);

// Actualizar un usuario
router.put('/:id', authenticateJWT, authorizeRole(1), userController.updateUser);

// Eliminar un usuario (solo para administradores)
router.delete('/:id', authenticateJWT, authorizeRole(1), userController.deleteUser);

// Ruta de login
router.post('/login', userController.login);

// cambio de contraseña
router.put('/:id/password', authenticateJWT, userController.changePassword);

module.exports = router;
