// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'adminolympia',
    host: 'localhost',
    database: 'olympiabd',
    password: 'bdstockolympia',
    port: 5432,
});

const checkConnection = async () => {
    try {
        const client = await pool.connect();
        client.release(); 
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error);
    }
};

module.exports = { pool, checkConnection };



