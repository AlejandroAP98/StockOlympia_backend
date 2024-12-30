// src/controllers/userController.js
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken'); // Para generar tokens
require('dotenv').config();
const bcrypt = require('bcrypt');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  createUser: async (req, res) => {
    try {
      const newUser = await UserModel.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.json(user);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedUser = await UserModel.update(id, req.body);
      if (!updatedUser) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await UserModel.delete(id);
      if (!deletedUser) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.status(204).send('usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  login: async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
      const user = await UserModel.findByUsername(usuario) || await UserModel.findByEmail(usuario);
      if (user && (await bcrypt.compare(contrasena, user.contrasena))) {
        const token = jwt.sign(
          { id: user.id, usuario: user.usuario, rol: user.id_rol, sala: user.id_sala },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        return res.json({ token, sala: user.id_sala, rol: user.id_rol });
      }
      res.status(401).send('Credenciales incorrectas');
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).send('Error en el servidor');
    }
  },
};

module.exports = userController;
