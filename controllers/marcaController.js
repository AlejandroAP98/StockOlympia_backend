// src/controllers/marcaController.js
const MarcaModel = require('../models/marcaModel');

const marcaController = {
  getAllMarcas: async (req, res) => {
    try {
      const marcas = await MarcaModel.getAll();
      res.json(marcas);
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  createMarca: async (req, res) => {
    try {
      const newMarca = await MarcaModel.create(req.body);
      res.status(201).json(newMarca);
    } catch (error) {
      console.error('Error al crear marca:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  getMarcaById: async (req, res) => {
    try {
      const marca = await MarcaModel.getById(req.params.id);
      if (!marca) return res.status(404).send('Marca no encontrada');
      res.json(marca);
    } catch (error) {
      console.error('Error al obtener marca:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  updateMarca: async (req, res) => {
    try {
      const updatedMarca = await MarcaModel.update(req.params.id, req.body);
      if (!updatedMarca) return res.status(404).send('Marca no encontrada');
      res.json(updatedMarca);
    } catch (error) {
      console.error('Error al actualizar marca:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  deleteMarca: async (req, res) => {
    try {
      const deletedMarca = await MarcaModel.delete(req.params.id);
      if (!deletedMarca) return res.status(404).send('Marca no encontrada');
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar marca:', error);
      res.status(500).send('Error en el servidor');
    }
  },
};

module.exports = marcaController;
