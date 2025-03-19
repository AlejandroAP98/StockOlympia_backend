const { pool } = require('../db');

const codigoController = {
  getAllCodigos: async (req, res) => {
    const { sala } = req.params;
    try {
      const query = `SELECT * FROM codigos_escaneados WHERE id_sala = $1`;
      const { rows } = await pool.query(query, [sala]);
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener códigos:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  createCodigo: async (req, res) => {
    const { codigo } = req.body;
    const sala = req.user.sala;
    if (!codigo) {
        return res.status(400).json({ error: "Código requerido" });
    }
    try {
        // Contar cuántos códigos hay en la sala
        const countQuery = `SELECT COUNT(*) FROM codigos_escaneados WHERE id_sala = $1`;
        const { rows } = await pool.query(countQuery, [sala]);
        const totalCodigos = parseInt(rows[0].count, 10);

        if (totalCodigos >= 10) {
            // Si hay 10 códigos, eliminar el más antiguo antes de insertar el nuevo
            const deleteOldestQuery = `
                DELETE FROM codigos_escaneados 
                WHERE id IN (SELECT id FROM codigos_escaneados WHERE id_sala = $1 ORDER BY fecha ASC LIMIT 1)
            `;
            await pool.query(deleteOldestQuery, [sala]);
        }
        // Insertar nuevo código
        const insertQuery = `INSERT INTO codigos_escaneados (codigo, id_sala, fecha) VALUES ($1, $2, NOW()) RETURNING *`;
        const { rows: inserted } = await pool.query(insertQuery, [codigo, sala]);
        res.status(201).json(inserted[0]);
    } catch (error) {
        console.error('Error al guardar código:', error);
        res.status(500).send('Error en el servidor');
    }
  },

  deleteCodigo: async (req, res) => {
    const { id } = req.params;
    const { sala } = req.params;
    const id_sala = sala;
    try {
      const query = `DELETE FROM codigos_escaneados WHERE id = $1 AND id_sala = $2 RETURNING *`;
      const { rowCount } = await pool.query(query, [id, id_sala]);

      if (rowCount === 0) {
        return res.status(404).json({ error: "Código no encontrado o no autorizado" });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar código:', error);
      res.status(500).send('Error en el servidor');
    }
  },
};

module.exports = codigoController;
