const { io } = require('../index'); // importando io
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado } = require('../controller/sockets');

// Mensajes de sockets - dispositivo (usuario) que se conecta al socket!
io.on('connection', client => {
    console.log('Cliente conectado: ');

    const [valido, uid] = comprobarJWT( client.handshake.headers['x-token'] );


    if( !valido ) { client.disconnect() };

    usuarioConectado(uid);
    
    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });
    


    // client.on('mensaje', ( payload ) => { // 'mensaje' mismo de html
    //     console.log('mensaje', payload);
    //     io.emit('mensaje', { admin: 'Nuevo mensaje' }); 
    // });
});