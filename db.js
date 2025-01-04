// db.js
require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    // database: process.env.DB_DATABASE,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

    ssl: {
        rejectUnauthorized: false,
    }
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



