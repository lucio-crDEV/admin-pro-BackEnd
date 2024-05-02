require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear servidor de express
const app = express();

// Configurar CORS (Middleware)
app.use( cors() );


// Carpeta pública
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// Rutas (Middleware)
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos', require('./routes/medicos') );
app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/uploads', require('./routes/uploads') );

// Levantando servidor
app.listen( process.env.PORT, () => {
        console.log('Servidor corriendo en el puerto: '+ process.env.PORT) 
    }
);
