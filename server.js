const express = require('express');
const { checkConnection } = require('./db'); 
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); 
const brandRoutes = require('./routes/brandRoutes');
const salaRoutes = require('./routes/salaRoutes');
const movimientoRoutes = require('./routes/movimientoRoute');
const salaProductoRoutes=require('./routes/salaProductoRoute');
const rolRouter = require('./routes/rolRoutes');
const codigoRoutes = require("./routes/codigoRoutes");
const test = require("./routes/test");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*',    
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE' ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
}));


app.use(express.json());


checkConnection();
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/salas', salaRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/salas_productos', salaProductoRoutes);
app.use('/api/roles', rolRouter)
app.use('/api/scanner', codigoRoutes);
app.use('/api/test', test);

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});