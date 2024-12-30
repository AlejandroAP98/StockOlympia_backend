// src/models/categoriaModel.js
const { pool } = require('../db');

const CategoriaModel = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM categorias');
    return result.rows;
  },

  create: async (categoria) => {
    const { nombre, descripcion } = categoria;
    const result = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    return result.rows[0];
  },

  getById: async (id) => {
    const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id, categoria) => {
    const { nombre, descripcion } = categoria;
    const result = await pool.query(
      'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = CategoriaModel;
