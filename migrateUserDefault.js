const { Pool } = require('pg');
const bcrypt = require('bcrypt'); 

const pool = new Pool({
    user: 'adminolympia',
    host: 'localhost',
    database: 'olympiabd',
    password: 'bdstockolympia',
    port: 5432,
});


async function createAdminUser() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Verificar si ya hay usuarios
    const result = await client.query('SELECT COUNT(*) FROM usuarios');
    const userCount = parseInt(result.rows[0].count, 10);

    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('1234', 10); // Reemplaza por una contraseña segura
      const adminUser = {
        nombre: 'Administrador',
        email: 'admin@admin.com',
        usuario: 'admin',
        contrasena: hashedPassword,
        id_rol: 1, 
        id_sala: null, 
      };

      const insertQuery = `
        INSERT INTO usuarios (nombre, email, usuario, contrasena, id_rol, id_sala)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(insertQuery, [
        adminUser.nombre,
        adminUser.email,
        adminUser.usuario,
        adminUser.contrasena,
        adminUser.id_rol,
        adminUser.id_sala,
      ]);

      console.log('Usuario administrador creado con éxito.');
    } else {
      console.log('Ya existen usuarios en el sistema, no es necesario crear uno nuevo.');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear el usuario administrador:', error);
  } finally {
    client.release();
  }
}

// Ejecutar la función
createAdminUser()
  .then(() => console.log('Proceso finalizado.'))
  .catch((error) => console.error('Error en el proceso:', error));
