// src/models/movimientoModel.js

const { pool } = require('../db');

const MovimientoModel = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT 
        movimientos.id,
        movimientos.id_sala,
        movimientos.cantidad,
        movimientos.tipo_movimiento,
        movimientos.fecha_movimiento AT TIME ZONE 'America/Bogota' AS fecha_movimiento,
        productos.nombre AS nombre_producto
      FROM movimientos
      JOIN productos ON movimientos.id_producto = productos.id
      ORDER BY movimientos.fecha_movimiento DESC
      LIMIT 1001
    `);
    
    
    result.rows.forEach(row => {
     
      row.fecha_movimiento = new Date(row.fecha_movimiento).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    });

  return result.rows;
  },

  create: async (movimiento) => {
    const { id_producto, id_sala, cantidad, tipo_movimiento } = movimiento;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Insertar el movimiento en la tabla `movimientos`
      const result = await client.query(
        'INSERT INTO movimientos (id_producto, id_sala, cantidad, tipo_movimiento) VALUES ($1, $2, $3, $4) RETURNING *',
        [id_producto, id_sala, cantidad, tipo_movimiento]
      );

      // Verificar si el producto ya existe en `salas_productos`
      const checkResult = await client.query(
        'SELECT cantidad FROM salas_productos WHERE id_producto = $1 AND id_sala = $2',
        [id_producto, id_sala]
      );

      if (checkResult.rows.length === 0) {
        // Si el producto no existe en `salas_productos` y es una "entrada", crearlo
        if (tipo_movimiento === "entrada") {
          await client.query(
            'INSERT INTO salas_productos (id_producto, id_sala, cantidad) VALUES ($1, $2, $3)',
            [id_producto, id_sala, cantidad]
          );
        } else {
          // Si el producto no existe y es una "salida", lanzar un error
          throw new Error("No hay suficientes productos para realizar la salida.");
        }
      } else {
        // Si el producto ya existe, verificar y actualizar la cantidad
        const currentQuantity = checkResult.rows[0].cantidad;

        if (tipo_movimiento === "entrada") {
          await client.query(
            'UPDATE salas_productos SET cantidad = cantidad + $1 WHERE id_producto = $2 AND id_sala = $3',
            [cantidad, id_producto, id_sala]
          );
        } else if (tipo_movimiento === "salida") {
          if (cantidad > currentQuantity) {
            // Si la cantidad de salida es mayor a la disponible, lanzar un error
            throw new Error("La cantidad de salida excede la cantidad disponible.");
          } else if (cantidad === currentQuantity) {
            // Si la cantidad de salida es igual a la disponible, eliminar el producto de la sala
            await client.query(
              'DELETE FROM salas_productos WHERE id_producto = $1 AND id_sala = $2',
              [id_producto, id_sala]
            );
          } else {
            // Si la cantidad de salida es menor a la disponible, actualizar la cantidad
            await client.query(
              'UPDATE salas_productos SET cantidad = cantidad - $1 WHERE id_producto = $2 AND id_sala = $3',
              [cantidad, id_producto, id_sala]
            );
          }
        }
      }

      await client.query("COMMIT");
      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  getById: async (id) => {
    const result = await pool.query('SELECT * FROM movimientos WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id, movimiento) => {
    const { id_producto, id_sala, cantidad, tipo_movimiento } = movimiento;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Actualizar la cantidad en `salas_productos` según el tipo de movimiento
      if (tipo_movimiento === "ingreso") {
        await client.query(
          'UPDATE salas_productos SET cantidad = cantidad + $1 WHERE id_producto = $2 AND id_sala = $3',
          [cantidad, id_producto, id_sala]
        );
      } else if (tipo_movimiento === "salida") {
        await client.query(
          'UPDATE salas_productos SET cantidad = cantidad - $1 WHERE id_producto = $2 AND id_sala = $3',
          [cantidad, id_producto, id_sala]
        );
      }

      await client.query("COMMIT");

      return await client.query(
        'UPDATE movimientos SET id_producto = $1, id_sala = $2, cantidad = $3, tipo_movimiento = $4 WHERE id = $5 RETURNING *',
        [id_producto, id_sala, cantidad, tipo_movimiento, id]
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM movimientos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
  
  getMovedProducts: async (startDate, endDate, id_sala, id_producto) => {
    const params = [];
    let query = `
      SELECT 
        productos.nombre AS nombre_producto,
        SUM(CASE WHEN movimientos.tipo_movimiento = 'entrada' THEN movimientos.cantidad ELSE 0 END) AS total_entradas,
        SUM(CASE WHEN movimientos.tipo_movimiento = 'salida' THEN movimientos.cantidad ELSE 0 END) AS total_salidas,
        COUNT(movimientos.id) AS total_movimientos
      FROM movimientos
      JOIN productos ON movimientos.id_producto = productos.id
    `;
  
    // Filtros por fecha
    if (startDate || endDate) {
      query += ` WHERE `;
      if (startDate) {
        const startDateLocal = new Date(startDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
        const startDateWithTime = new Date(startDateLocal);
        startDateWithTime.setHours(23, 59, 59, 999);
        const startDateUTC = startDateWithTime.toISOString();
        params.push(startDateUTC);
        query += ` movimientos.fecha_movimiento >= $${params.length}`;
      }
      if (endDate) {
        if (params.length > 0) query += ` AND `;
        const endDateLocal = new Date(endDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
        const endDateWithTime = new Date(endDateLocal);
        endDateWithTime.setHours(47, 59, 59, 999);
        const endDateUTC = endDateWithTime.toISOString();
        params.push(endDateUTC);
        query += ` movimientos.fecha_movimiento <= $${params.length}`;
      }
    }
  
    if (id_sala) {
      if (params.length > 0) query += ` AND `;
      params.push(id_sala);
      query += ` movimientos.id_sala = $${params.length}`;
    }
  
    if (id_producto) {
      if (params.length > 0) query += ` AND `;
      params.push(id_producto);
      query += ` movimientos.id_producto = $${params.length}`;
    }
    
    query += `
      GROUP BY productos.nombre
      ORDER BY total_movimientos DESC
    `;
    const result = await pool.query(query, params);
    return result.rows;
  },

  getWithOutOutputProducts: async (startDate, endDate, id_sala, id_producto) => {
    const params = [];
    let query = `
      SELECT 
        productos.nombre AS nombre_producto,
        SUM(CASE WHEN movimientos.tipo_movimiento = 'entrada' THEN movimientos.cantidad ELSE 0 END) AS total_entradas,
        SUM(CASE WHEN movimientos.tipo_movimiento = 'salida' THEN movimientos.cantidad ELSE 0 END) AS total_salidas
      FROM productos
      LEFT JOIN movimientos ON productos.id = movimientos.id_producto
    `;
  
    let whereClauses = [];
    
    if (startDate) {
      const startDateLocal = new Date(startDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
      const startDateWithTime = new Date(startDateLocal);
      startDateWithTime.setHours(23, 59, 59, 999);
      const startDateUTC = startDateWithTime.toISOString();
      params.push(startDateUTC);
      whereClauses.push(`movimientos.fecha_movimiento >= $${params.length}`);
    }
    if (endDate) {
      const endDateLocal = new Date(endDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
      const endDateWithTime = new Date(endDateLocal);
      endDateWithTime.setHours(47, 59, 59, 999); // Final del día
      const endDateUTC = endDateWithTime.toISOString();
      params.push(endDateUTC);
      whereClauses.push(`movimientos.fecha_movimiento <= $${params.length}`);
    }
    if (id_sala) {
      params.push(id_sala);
      whereClauses.push(`movimientos.id_sala = $${params.length}`);
    }
    if (id_producto) {
      params.push(id_producto);
      whereClauses.push(`productos.id = $${params.length}`);
    }
  
    if (whereClauses.length > 0) {
      query += ` WHERE ` + whereClauses.join(" AND ");
    }

    query += `
      GROUP BY productos.nombre
      HAVING SUM(CASE WHEN movimientos.tipo_movimiento = 'salida' THEN movimientos.cantidad ELSE 0 END) = 0
      ORDER BY total_entradas DESC
    `;
  
    // Ejecutar la consulta
    try {
      const result = await pool.query(query, params);
      return result.rows;
      
    } catch (error) {
      console.error("Error al obtener productos sin salida:", error);
      throw error;
    }
    
  },
  
  getHistoryProduct: async (startDate, endDate, id_sala, id_producto, id_categoria, id_marca) => {
    const params = [];
    let query = `
      SELECT
        productos.nombre AS nombre_producto,
        categorias.nombre AS nombre_categoria_producto,
        marcas.nombre AS nombre_marca,
        movimientos.tipo_movimiento,
        movimientos.cantidad,
        movimientos.fecha_movimiento,
        salas.nombre AS nombre_sala
      FROM movimientos
      JOIN productos ON movimientos.id_producto = productos.id
      JOIN salas ON movimientos.id_sala = salas.id
      JOIN categorias ON productos.id_categoria = categorias.id
      JOIN marcas ON productos.id_marca = marcas.id
      WHERE 1=1
    `;
  
    // Si se pasa un id_producto, lo agregamos a la consulta
    if (id_producto) {
      query += ` AND movimientos.id_producto = $${params.length + 1}`;
      params.push(id_producto);
    }
  
    // Si se pasa un id_sala, lo agregamos a la consulta
    if (id_sala) {
      query += ` AND movimientos.id_sala = $${params.length + 1}`;
      params.push(id_sala);
    }

    //si se pasa un id_categoria, lo agregamos a la consulta
    if (id_categoria) {
      query += ` AND productos.id_categoria = $${params.length + 1}`;
      params.push(id_categoria);
    }

    //si se pasa un id_marca, lo agregamos a la consulta
    if (id_marca) {
      query += ` AND productos.id_marca = $${params.length + 1}`;
      params.push(id_marca);
    }
    
    // Solo agregamos las fechas si están presentes
    let hasDateCondition = false;
  
    if (startDate) {
      const startDateLocal = new Date(startDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
      const startDateWithTime = new Date(startDateLocal);
      startDateWithTime.setHours(23, 59, 59, 999);
      const startDateUTC = startDateWithTime.toISOString();
      params.push(startDateUTC);
      query += ` AND movimientos.fecha_movimiento >= $${params.length}`;
      hasDateCondition = true;
    }
  
    if (endDate) {
      // Si ya hemos agregado una condición de fecha, agregamos AND
      if (hasDateCondition) query += ` AND `;
      
      const endDateLocal = new Date(endDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
      const endDateWithTime = new Date(endDateLocal);
      endDateWithTime.setHours(47, 59, 59, 999);
      const endDateUTC = endDateWithTime.toISOString();
      params.push(endDateUTC);
      query += ` movimientos.fecha_movimiento <= $${params.length}`;
    }
  
    query += `
      ORDER BY movimientos.fecha_movimiento DESC
      LIMIT 1000
    `;
  
    const result = await pool.query(query, params);
    
    result.rows.forEach(row => {
      row.fecha_movimiento = new Date(row.fecha_movimiento).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    });
    return result.rows;
  },

  getCostInputs: async (startDate, endDate, id_sala, id_producto, id_categoria, id_marca) => {
    const params = [];
    let query = `
      SELECT
        productos.nombre AS nombre_producto,
        categorias.nombre AS nombre_categoria_producto,
        marcas.nombre AS nombre_marca,
        movimientos.tipo_movimiento,
        movimientos.cantidad,
        productos.precio,
        (movimientos.cantidad * productos.precio) AS valor_total,
        movimientos.fecha_movimiento,
        salas.nombre AS nombre_sala
      FROM movimientos
      JOIN productos ON movimientos.id_producto = productos.id
      JOIN salas ON movimientos.id_sala = salas.id
      JOIN categorias ON productos.id_categoria = categorias.id
      JOIN marcas ON productos.id_marca = marcas.id
      WHERE movimientos.tipo_movimiento = 'entrada' 
    `;
  
    // Si se pasa un id_producto, lo agregamos a la consulta
    if (id_producto) {
      query += ` AND movimientos.id_producto = $${params.length + 1}`;
      params.push(id_producto);
    }
  
    // Si se pasa un id_sala, lo agregamos a la consulta
    if (id_sala) {
      query += ` AND movimientos.id_sala = $${params.length + 1}`;
      params.push(id_sala);
    }

    //si se pasa un id_categoria, lo agregamos a la consulta
    if (id_categoria) {
      query += ` AND productos.id_categoria = $${params.length + 1}`;
      params.push(id_categoria);
    }

    //si se pasa un id_marca, lo agregamos a la consulta
    if (id_marca) {
      query += ` AND productos.id_marca = $${params.length + 1}`;
      params.push(id_marca);
    }

    // Solo agregamos las fechas si están presentes
    let hasDateCondition = false;
  
    if (startDate) {
      const startDateLocal = new Date(startDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
      const startDateWithTime = new Date(startDateLocal);
      startDateWithTime.setHours(23, 59, 59, 999);
      const startDateUTC = startDateWithTime.toISOString();
      params.push(startDateUTC);
      query += ` AND movimientos.fecha_movimiento >= $${params.length}`;
      hasDateCondition = true;
    }
  
    if (endDate) {
      // Si ya hemos agregado una condición de fecha, agregamos AND
      if (hasDateCondition) query += ` AND `;
      
      const endDateLocal = new Date(endDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
      const endDateWithTime = new Date(endDateLocal);
      endDateWithTime.setHours(47, 59, 59, 999);
      const endDateUTC = endDateWithTime.toISOString();
      params.push(endDateUTC);
      query += ` movimientos.fecha_movimiento <= $${params.length}`;
    }
  
    query += `
      ORDER BY movimientos.fecha_movimiento DESC
    `;
  
    const result = await pool.query(query, params);
    
    result.rows.forEach(row => {
      row.fecha_movimiento = new Date(row.fecha_movimiento).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    });
    return result.rows;
  },

  getChartEntradasSalas: async (startDate, endDate, id_sala) => {
    const params = [];
    let query = `
      SELECT
      (movimientos.cantidad * productos.precio) AS valor,
      movimientos.fecha_movimiento AS fecha,
      salas.nombre AS sala
      FROM movimientos
      JOIN productos ON movimientos.id_producto = productos.id
      JOIN salas ON movimientos.id_sala = salas.id
      WHERE movimientos.tipo_movimiento = 'entrada'
    `;
    if (id_sala) {
      query += ` AND movimientos.id_sala = ${id_sala}`;
    }

    // Solo agregamos las fechas si están presentes
    let hasDateCondition = false;
  
    if (startDate) {
      const startDateLocal = new Date(startDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
      const startDateWithTime = new Date(startDateLocal);
      startDateWithTime.setHours(23, 59, 59, 999);
      const startDateUTC = startDateWithTime.toISOString();
      params.push(startDateUTC);
      query += ` AND movimientos.fecha_movimiento >= $${params.length}`;
      hasDateCondition = true;
    }
  
    if (endDate) {
      // Si ya hemos agregado una condición de fecha, agregamos AND
      if (hasDateCondition) query += ` AND `;
      
      const endDateLocal = new Date(endDate).toLocaleString("en-US", { timeZone: "America/Bogota" });
      const endDateWithTime = new Date(endDateLocal);
      endDateWithTime.setHours(47, 59, 59, 999);
      const endDateUTC = endDateWithTime.toISOString();
      params.push(endDateUTC);
      query += ` movimientos.fecha_movimiento <= $${params.length}`;
    }
    query += `
      ORDER BY movimientos.fecha_movimiento ASC
    `;
    const result = await pool.query(query, params);
    result.rows.forEach(row => {
      row.fecha = new Date(row.fecha).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });
    });
    return result.rows;
  },
};

module.exports = MovimientoModel;
