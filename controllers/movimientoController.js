// src/controllers/movimientoController.js
const MovimientoModel = require('../models/movimientoModel');
const { get } = require('../routes/userRoutes');

const movimientoController = {
  getAllMovimientos: async (req, res) => {
    try {
      const movimientos = await MovimientoModel.getAll();
      res.json(movimientos);
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  createMovimiento: async (req, res) => {
    try {
      const newMovimiento = await MovimientoModel.create(req.body);
      res.status(201).json(newMovimiento);
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  getMovimientoById: async (req, res) => {
    try {
      const movimiento = await MovimientoModel.getById(req.params.id);
      if (!movimiento) return res.status(404).send('Movimiento no encontrado');
      res.json(movimiento);
    } catch (error) {
      console.error('Error al obtener movimiento:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  updateMovimiento: async (req, res) => {
    try {
      const updatedMovimiento = await MovimientoModel.update(req.params.id, req.body);
      if (!updatedMovimiento) return res.status(404).send('Movimiento no encontrado');
      res.json(updatedMovimiento);
    } catch (error) {
      console.error('Error al actualizar movimiento:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  deleteMovimiento: async (req, res) => {
    try {
      const deletedMovimiento = await MovimientoModel.delete(req.params.id);
      if (!deletedMovimiento) return res.status(404).send('Movimiento no encontrado');
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      res.status(500).send('Error en el servidor');
    }
  },
  
  getMovedProducts: async (req, res) => {
    try {
      const { startDate, endDate, id_sala, id_producto } = req.query; 
      const reporte = await MovimientoModel.getMovedProducts(startDate, endDate, id_sala, id_producto);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error obteniendo el reporte de productos más movidos:', error);
      res.status(500).json({ error: 'Error al obtener el reporte' });
    }
  },

  getWithOutOutputProducts: async (req, res) => {
    try {
      const { startDate, endDate, id_sala, id_producto } = req.query;
      const reporte = await MovimientoModel.getWithOutOutputProducts(startDate, endDate, id_sala, id_producto);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error obteniendo el reporte de productos sin salida:', error);
      res.status(500).json({ error: 'Error al obtener el reporte' });
    }
  },

  getHistoryProduct: async (req, res)=>{
    try {
      const { startDate, endDate, id_sala, id_producto , id_categoria, id_marca } = req.query;
      const reporte = await MovimientoModel.getHistoryProduct(startDate, endDate, id_sala, id_producto, id_categoria, id_marca);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error obteniendo el reporte de movimiento de producto:', error);
      res.status(500).json({ error: 'Error al obtener el reporte' });
    }
  },

  getCostInputs: async (req, res)=>{
    try {
      const { startDate, endDate, id_sala, id_producto, id_categoria, id_marca } = req.query;
      const reporte = await MovimientoModel.getCostInputs(startDate, endDate, id_sala, id_producto , id_categoria, id_marca);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error obteniendo el reporte de movimiento de producto:', error);
      res.status(500).json({ error: 'Error al obtener el reporte' });
    }
  },

  getChartEntradasSalas: async (req, res) => {
    try {
      const { startDate, endDate, id_sala, id_producto } = req.query;
      const reporte = await MovimientoModel.getChartEntradasSalas(startDate, endDate, id_sala, id_producto);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error obteniendo el reporte de movimiento de producto:', error);
      res.status(500).json({ error: 'Error al obtener el reporte' });
    }
  },

  
  getChartSalidasSalas: async (req, res) => {
    try {
      const { startDate, endDate, id_sala, id_producto } = req.query;
      const reporte = await MovimientoModel.getChartSalidasSalas(startDate, endDate, id_sala, id_producto);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error obteniendo el reporte de movimiento de salidas:', error);
      res.status(500).json({ error: 'Error al obtener el reporte' });
    }
  },
  
};

module.exports = movimientoController;
