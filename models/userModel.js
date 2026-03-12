// src/models/userModel.js
const { pool } = require('../db'); 
const bcrypt = require('bcryptjs'); 

const UserModel = {
  // 1. Modificado: Solo trae usuarios activos
  findAll: async () => {
    const result = await pool.query('SELECT id, nombre, email, usuario, id_rol, fecha_creacion, id_sala FROM usuarios WHERE activo = true');
    return result.rows;
  },

  create: async (user) => {
    const { nombre, email, contrasena, usuario, id_rol, id_sala } = user;
    const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : null;

    const columns = [];
    const values = [];

    if (nombre) { columns.push("nombre"); values.push(nombre); }
    if (email) { columns.push("email"); values.push(email); }
    if (hashedPassword) { columns.push("contrasena"); values.push(hashedPassword); }
    if (usuario) { columns.push("usuario"); values.push(usuario); }
    if (id_rol) { columns.push("id_rol"); values.push(id_rol); }
    if (id_sala) { columns.push("id_sala"); values.push(id_sala); }

    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
        INSERT INTO usuarios (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Busca por ID sin importar si está activo (útil para el historial de movimientos)
  findById: async (id) => {
    const result = await pool.query('SELECT id, nombre, email, contrasena, id_rol, fecha_creacion, usuario, id_sala, activo FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id, user) => {
    const { nombre, email, contrasena, usuario, id_rol, id_sala } = user;
    let hashedPassword;
    if (contrasena) {
      hashedPassword = await bcrypt.hash(contrasena, 10);
    }

    let result;
    if (hashedPassword) {
      result = await pool.query(
        'UPDATE usuarios SET nombre = $1, email = $2, contrasena = $3, usuario = $4, id_rol = $5, id_sala = $6 WHERE id = $7 RETURNING *',
        [nombre, email, hashedPassword, usuario, id_rol, id_sala, id]
      );
    } else {
      result = await pool.query(
        'UPDATE usuarios SET nombre = $1, email = $2, usuario = $3, id_rol = $4, id_sala = $5 WHERE id = $6 RETURNING *',
        [nombre, email, usuario, id_rol, id_sala, id]
      );
    }
    return result.rows[0];
  },

  // 2. Modificado: Borrado lógico (Soft Delete)
  delete: async (id) => {
    const result = await pool.query('UPDATE usuarios SET activo = false WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // 3. Modificado: Solo permite login a usuarios activos
  findByUsername: async (username) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND activo = true', [username]);
    return result.rows[0];
  },

  // 4. Modificado: Solo permite login a usuarios activos
  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND activo = true', [email]);
    return result.rows[0];
  }
};

module.exports = UserModel;