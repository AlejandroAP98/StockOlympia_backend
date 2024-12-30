// src/controllers/categoriaController.js
const CategoriaModel = require('../models/categoriaModel');

const categoriaController = {
  getAllCategorias: async (req, res) => {
    try {
      const categorias = await CategoriaModel.getAll();
      res.json(categorias);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  createCategoria: async (req, res) => {
    try {
      const newCategoria = await CategoriaModel.create(req.body);
      res.status(201).json(newCategoria);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  getCategoriaById: async (req, res) => {
    try {
      const categoria = await CategoriaModel.getById(req.params.id);
      if (!categoria) return res.status(404).send('Categoría no encontrada');
      res.json(categoria);
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  updateCategoria: async (req, res) => {
    try {
      const updatedCategoria = await CategoriaModel.update(req.params.id, req.body);
      if (!updatedCategoria) return res.status(404).send('Categoría no encontrada');
      res.json(updatedCategoria);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  deleteCategoria: async (req, res) => {
    try {
      const deletedCategoria = await CategoriaModel.delete(req.params.id);
      if (!deletedCategoria) return res.status(404).send('Categoría no encontrada');
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      res.status(500).send('Error en el servidor');
    }
  },
};

module.exports = categoriaController;
