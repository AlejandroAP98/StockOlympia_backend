// src/models/marcaModel.js
const { pool } = require('../db');

const MarcaModel = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM marcas');
    return result.rows;
  },

  create: async (marca) => {
    const { nombre, descripcion } = marca;
    const result = await pool.query(
      'INSERT INTO marcas (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    return result.rows[0];
  },

  getById: async (id) => {
    const result = await pool.query('SELECT * FROM marcas WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id, marca) => {
    const { nombre, descripcion } = marca;
    const result = await pool.query(
      'UPDATE marcas SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM marcas WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = MarcaModel;
