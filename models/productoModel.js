// src/models/productoModel.js
const { pool } = require('../db'); // Asegúrate de importar tu conexión a la base de datos

const ProductoModel = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM productos');
    return result.rows;
  },

  create: async (producto) => {
    const { nombre, cantidad, id_categoria, id_marca, precio } = producto;
  
    // Verificar si el producto ya existe
    const checkProduct = await pool.query(
      'SELECT * FROM productos WHERE nombre = $1',
      [nombre]
    );
  
    if (checkProduct.rows.length > 0) {
      throw new Error('El producto con ese nombre ya existe');
    }
  
    // Insertar el producto si no existe
    const result = await pool.query(
      'INSERT INTO productos (nombre, cantidad, id_categoria, id_marca, precio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, cantidad, id_categoria, id_marca, precio]
    );
  
    return result.rows[0];
  },
  

  update: async (id, producto) => {
    const { nombre, cantidad, id_categoria, id_marca, precio } = producto;
    const result = await pool.query(
      'UPDATE productos SET nombre = $1, cantidad = $2, id_categoria = $3, id_marca = $4, precio = $5 WHERE id = $6 RETURNING *',
      [nombre, cantidad, id_categoria, id_marca, precio, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = ProductoModel;


