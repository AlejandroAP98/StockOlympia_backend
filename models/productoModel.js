// src/models/productoModel.js
const { pool } = require('../db'); // Asegúrate de importar la conexión a la base de datos

const ProductoModel = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM productos');
    return result.rows;
  },

  create: async (producto) => {
    const { nombre, cantidad, id_categoria, id_marca, precio, codigo } = producto;

    // Verificar si ya existe un producto con el mismo código de barras
    const existingCode = await pool.query(
      'SELECT * FROM productos WHERE codigo = $1',
      [codigo]
    );

    if (existingCode.rows.length > 0) {
      throw new Error('Ya existe un producto con este código de barras');
    }

    // Verificar si ya existe un producto con el mismo nombre y marca
    const existingProduct = await pool.query(
      'SELECT * FROM productos WHERE LOWER(nombre) = LOWER($1) AND id_marca = $2',
      [nombre, id_marca]
    );

    if (existingProduct.rows.length > 0) {
      throw new Error('Ya existe un producto con el mismo nombre y marca');
    }

    // Insertar el nuevo producto con código de barras
    const result = await pool.query(
      'INSERT INTO productos (nombre, cantidad, id_categoria, id_marca, precio, codigo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, cantidad, id_categoria, id_marca, precio, codigo]
    );

    return result.rows[0];
  },

  update: async (id, producto) => {
    const { nombre, cantidad, id_categoria, id_marca, precio, codigo } = producto;

    // Actualizar el producto, incluyendo el código de barras
    const result = await pool.query(
      'UPDATE productos SET nombre = $1, cantidad = $2, id_categoria = $3, id_marca = $4, precio = $5, codigo = $6 WHERE id = $7 RETURNING *',
      [nombre, cantidad, id_categoria, id_marca, precio, codigo, id]
    );

    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  findByBarcode: async (codigo) => {
    const result = await pool.query('SELECT * FROM productos WHERE codigo = $1', [codigo]);
    return result.rows[0];
  },
};

module.exports = ProductoModel;
