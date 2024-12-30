// src/controllers/salaController.js
const SalaModel = require('../models/salaModel');

const salaController = {
  getAllSalas: async (req, res) => {
    try {
      const salas = await SalaModel.findAll();
      res.json(salas);
    } catch (error) {
      console.error('Error al obtener salas:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  createSala: async (req, res) => {
    try {
      const newSala = await SalaModel.create(req.body);
      res.status(201).json(newSala);
    } catch (error) {
      console.error('Error al crear sala:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  getSalaById: async (req, res) => {
    const { id } = req.params;
    try {
      const sala = await SalaModel.findById(id);
      if (!sala) {
        return res.status(404).send('Sala no encontrada');
      }
      res.json(sala);
    } catch (error) {
      console.error('Error al obtener sala:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  updateSala: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedSala = await SalaModel.update(id, req.body);
      if (!updatedSala) {
        return res.status(404).send('Sala no encontrada');
      }
      res.json(updatedSala);
    } catch (error) {
      console.error('Error al actualizar sala:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  deleteSala: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedSala = await SalaModel.delete(id);
      if (!deletedSala) {
        return res.status(404).send('Sala no encontrada');
      }
      res.status(204).send(); // No hay contenido para enviar de vuelta
    } catch (error) {
      console.error('Error al eliminar sala:', error);
      res.status(500).send('Error en el servidor');
    }
  },
};

module.exports = salaController;
