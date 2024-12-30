// src/models/salaModel.js
const { pool } = require('../db'); // Asegúrate de importar tu conexión a la base de datos

const SalaModel = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM salas ORDER BY nombre ASC');
    return result.rows;
  },

  create: async (sala) => {
    const { nombre, direccion, numero_maquinas, municipio } = sala;
    const result = await pool.query(
      'INSERT INTO salas (nombre, direccion, numero_maquinas, municipio) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, direccion, numero_maquinas, municipio]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM salas WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id, sala) => {
    const { nombre, direccion, numero_maquinas, municipio } = sala;
    const result = await pool.query(
      'UPDATE salas SET nombre = $1, direccion = $2, numero_maquinas = $3, municipio = $4 WHERE id = $5 RETURNING *',
      [nombre, direccion, numero_maquinas, municipio, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM salas WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = SalaModel;
