// src/controllers/rolController.js
const Rol = require('../models/rolModel');

const rolController = {
  findAll: async (req, res) => {
    try {
      const roles = await Rol.findAll();     
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener roles' });
    }
  },

  findById: async (req, res) => {
    const { id } = req.params;
    try {
      const rol = await Rol.findById(id);
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json(rol);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el rol' });
    }
  },

  create: async (req, res) => {
    try {
      const nuevoRol = await Rol.create(req.body);
      res.status(201).json(nuevoRol);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el rol' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    try {
      const rolActualizado = await Rol.update(id, req.body);
      if (!rolActualizado) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json(rolActualizado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el rol' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await Rol.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el rol' });
    }
  },
};

module.exports = rolController;
