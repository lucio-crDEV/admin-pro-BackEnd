require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear servidor de express
const app = express();

// Configurar CORS (Middleware)
app.use( cors() );

// Base de datos
dbConnection();

// Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );

// Levantando servidor
app.listen( process.env.PORT, () => {
        console.log('Servidor corriendo en el puerto: '+ process.env.PORT) 
    }
);
