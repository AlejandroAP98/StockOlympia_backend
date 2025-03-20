// src/models/salaProductoModel.js
const { pool } = require('../db'); // Asegúrate de importar tu conexión a la base de datos

const SalaProductoModel = {
  findAllBySalaId: async (id_sala) => {
    const result = await pool.query(`
      SELECT * 
      FROM salas_productos 
      WHERE id_sala = $1 
      ORDER BY id ASC
    `, [id_sala]);
    return result.rows;
  },

  findAllByCodigoAndSala: async (codigo, id_sala) => {
    const result = await pool.query(`
      SELECT sp.*, p.nombre as nombre_producto
      FROM salas_productos sp
      JOIN productos p ON sp.id_producto = p.id
      WHERE p.codigo = $1 AND sp.id_sala = $2
    `, [codigo, id_sala]);
    return result.rows; 
  },

  create: async (salaProducto) => {
    const { id_sala, id_producto, cantidad } = salaProducto;
    const result = await pool.query(
      'INSERT INTO salas_productos (id_sala, id_producto, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [id_sala, id_producto, cantidad]
    );
    return result.rows[0];
  },

  update: async (id, cantidad) => {
    const result = await pool.query(
      'UPDATE salas_productos SET cantidad = $1 WHERE id = $2 RETURNING *',
      [cantidad, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM salas_productos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = SalaProductoModel;
