const express = require('express');
const path = require('path');
require('dotenv').config(); // establece variables de entorno

// TODO: ACTUALIZAR MONGOATLAS EN LA NUBE
const { dbConnection } = require('./database/config');
dbConnection();

const app = express(); // inicializa express, es compatible con server
app.use( express.json() );  // lectura y parse de peticion http

// Servidor de sockets
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server); // exportando io
require('./sockets/socket.js'); // llamar a socket.js === ./


// path publico - carpeta publica
const publicPath = path.resolve( __dirname, 'public' ); // __dirname apuntando a la carpeta o dominio
app.use( express.static( publicPath )); // express utiliza el app publico

// CREAR APIS
app.use( '/api/login', require('./routes/auth'));

app.use( '/api/paciente', require('./routes/paciente'));

app.use( '/api/citas', require('./routes/citas'));


// iniciar con express
server.listen( process.env.PORT, (err) => {
    if ( err ) throw new Error(err); // ver el error si es que lo hay
    console.log('Servidor corriendo en puerto', process.env.PORT);
});