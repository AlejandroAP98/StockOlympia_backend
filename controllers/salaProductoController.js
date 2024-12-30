// src/controllers/salaProductoController.js
const SalaProductoModel = require('../models/salaProductoModel');
const { pool } = require('../db');
const e = require('express');

const salaProductoController = {
  getProductsBySalaId: async (req, res) => {
    const { id_sala } = req.params;
    try {
      const query = `
        SELECT 
          p.id, 
          p.nombre, 
          p.precio,
          p.id_categoria,
          p.id_marca, 
          ps.cantidad, 
          ps.id_sala
        FROM 
          salas_productos ps
        JOIN 
          productos p 
        ON 
          ps.id_producto = p.id
        WHERE 
          ps.id_sala = $1
        ORDER BY p.nombre ASC
      `;

      // Ejecutar la consulta
      const { rows } = await pool.query(query, [id_sala]);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  },

  createSalaProducto: async (req, res) => {
    try {
      const newSalaProducto = await SalaProductoModel.create(req.body);
      res.status(201).json(newSalaProducto);
    } catch (error) {
      console.error('Error al crear relación sala-producto:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  updateSalaProducto: async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;
    try {
      const updatedSalaProducto = await SalaProductoModel.update(id, cantidad);
      if (!updatedSalaProducto) {
        return res.status(404).send('Relación sala-producto no encontrada');
      }
      res.json(updatedSalaProducto);
    } catch (error) {
      console.error('Error al actualizar relación sala-producto:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  deleteSalaProducto: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedSalaProducto = await SalaProductoModel.delete(id);
      if (!deletedSalaProducto) {
        return res.status(404).send('Relación sala-producto no encontrada');
      }
      res.status(204).send(); // No hay contenido para enviar de vuelta
    } catch (error) {
      console.error('Error al eliminar relación sala-producto:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  searchSalaProductos: async (req, res) => {
    const { term } = req.query;
    const { id_sala } = req.params;
    try {
      const query = `
        SELECT 
          p.id, 
          p.nombre, 
          p.precio,
          p.id_categoria,
          p.id_marca, 
          ps.cantidad, 
          ps.id_sala
        FROM 
          salas_productos ps
        JOIN 
          productos p 
        ON 
          ps.id_producto = p.id
        WHERE 
          ps.id_sala = $1
          AND p.nombre ILIKE $2

      `;
      const values = [id_sala, `%${term}%`];
      const { rows } = await pool.query(query, values);
      res.json(rows);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  getValorTotalEntradasPorMes: async (req, res) => {
    const { id_sala, year, month } = req.query;
    if (!id_sala || !year || !month) {
      return res.status(400).json({ error: 'Faltan parámetros: id_sala, year, month son requeridos.' });
    }
    try {
      // Convertimos el año y mes en rangos de fecha
      const startDate = new Date(year, month - 1, 1); // Primer día del mes
      const endDate = new Date(year, month, 0); // Último día del mes
      endDate.setHours(47, 59, 59, 999);
      // Query
      const query = `
        SELECT 
          SUM(movimientos.cantidad * productos.precio) AS valor_total
        FROM movimientos
        JOIN productos ON movimientos.id_producto = productos.id
        WHERE movimientos.tipo_movimiento = 'entrada'
          AND movimientos.id_sala = $1
          AND movimientos.fecha_movimiento BETWEEN $2 AND $3;
      `;
  
      const params = [id_sala, startDate.toISOString(), endDate.toISOString()];
  
      // Ejecutamos la consulta
      const result = await pool.query(query, params);
  
      const valorTotal = result.rows[0].valor_total || 0; // Si no hay resultados, asumimos valor 0
  
      res.status(200).json({ id_sala, year, month, valor_total: valorTotal });
    } catch (error) {
      console.error('Error al obtener el valor total de entradas:', error);
      res.status(500).json({ error: 'Error al obtener el valor total de entradas.' });
    }
  },
  
};

module.exports = salaProductoController;
