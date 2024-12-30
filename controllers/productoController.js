// src/controllers/productoController.js
const ProductoModel = require('../models/productoModel');
const { pool } = require('../db');

const productoController = {
  getAllProducts: async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id, 
                p.nombre, 
                p.precio, 
                p.id_categoria, 
                p.id_marca, 
                COALESCE(SUM(sp.cantidad), 0) AS cantidad
            FROM 
                productos p
            LEFT JOIN 
                salas_productos sp ON p.id = sp.id_producto
            GROUP BY 
                p.id
            ORDER BY p.nombre ASC 
        `;

        const { rows: products } = await pool.query(query); 
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor');
    }
  },


  createProduct: async (req, res) => {
    try {
      const newProduct = await ProductoModel.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedProduct = await ProductoModel.update(id, req.body);
      if (!updatedProduct) {
        return res.status(404).send('Producto no encontrado');
      }
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedProduct = await ProductoModel.delete(id);
      if (!deletedProduct) {
        return res.status(404).send('Producto no encontrado');
      }
      res.status(204).send(); // No hay contenido para enviar de vuelta
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  searchProducts: async (req, res) => {
    const { term } = req.query;
    try {
      const query = `
        SELECT 
          p.id, 
          p.nombre, 
          p.precio, 
          p.id_categoria, 
          p.id_marca, 
          COALESCE(SUM(sp.cantidad), 0) AS cantidad
        FROM 
          productos p
        LEFT JOIN 
          salas_productos sp ON p.id = sp.id_producto
        WHERE 
          p.nombre ILIKE $1
        GROUP BY 
          p.id
      `;
  
      const values = [`%${term}%`]; 
      const { rows: products } = await pool.query(query, values);
      res.json(products);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).send('Error en el servidor');
    }
  },
  
};

module.exports = productoController;
