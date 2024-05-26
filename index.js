require('dotenv').config();

const cors = require('cors');
const express = require('express');
const path = require('path');

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

app.get('*', (req, res)=>{
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) )
})
// Levantando servidor
app.listen( process.env.PORT, () => {
        console.log('Servidor corriendo en el puerto: '+ process.env.PORT) 
    }
);
