// src/models/rolModel.js
const { pool } = require('../db');// Asegúrate de que esta sea tu conexión a PostgreSQL

const Rol = {
  findAll: async () => {
    const { rows } = await pool.query('SELECT * FROM roles');
    return rows;
  },

  findById: async (id) => {
    const { rows } = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    return rows[0];
  },

  create: async (rol) => {
    const { nombre } = rol;
    const { rows } = await pool.query('INSERT INTO roles (rol) VALUES ($1) RETURNING *', [nombre]);
    return rows[0];
  },

  update: async (id, rol) => {
    const { nombre } = rol;
    const { rows } = await pool.query('UPDATE roles SET rol = $1 WHERE id = $2 RETURNING *', [nombre, id]);
    return rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM roles WHERE id = $1', [id]);
  },
};

module.exports = Rol;
