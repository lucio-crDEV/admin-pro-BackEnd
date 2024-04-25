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
app.get( '/', (req,res)=>{

    res.json( {
        ok: true,
        msg: 'Hola Mundo'
    } );
});

app.listen( process.env.PORT, () => {
        console.log('Servidor corriendo en el puerto: '+ process.env.PORT) 
    }
);