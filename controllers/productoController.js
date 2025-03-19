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
          p.codigo, 
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
      const { nombre, cantidad, id_categoria, id_marca, precio, codigo } = req.body;
  
      if (!codigo) {
        return res.status(400).json({ message: 'El código de barras es obligatorio' });
      }
  
      const newProduct = await ProductoModel.create({ nombre, cantidad, id_categoria, id_marca, precio, codigo });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ message: error.message || 'Error en el servidor' });
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
      res.status(204).send();
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
          p.codigo, 
          p.id_categoria, 
          p.id_marca, 
          COALESCE(SUM(sp.cantidad), 0) AS cantidad
        FROM 
          productos p
        LEFT JOIN 
          salas_productos sp ON p.id = sp.id_producto
        WHERE 
          p.nombre ILIKE $1 OR p.codigo ILIKE $2
        GROUP BY 
          p.id, sp.cantidad
      `;

      const values = [`%${term}%`, `%${term}%`];
      const { rows: products } = await pool.query(query, values);
      res.json(products);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  getProductByBarcode: async (req, res) => {
    const { codigo } = req.params;
    try {
      const product = await ProductoModel.findByBarcode(codigo);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error al buscar producto por código de barras:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  getLastScannedCode: async (req, res) => {
    try {
      const { sala } = req.user;
      const result = await pool.query(
        `SELECT codigo FROM codigos_escaneados 
         WHERE id_sala = $1 
         ORDER BY fecha DESC 
         LIMIT 1`, 
        [sala]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No hay códigos escaneados recientes." });
      }
  
      res.json({ codigo: result.rows[0].codigo });
    } catch (error) {
      console.error('Error al obtener el código escaneado:', error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
  
  
};

module.exports = productoController;
