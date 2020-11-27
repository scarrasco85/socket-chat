// Socket clients functions

// var to have higth compatibility
var socket = io();

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Send information
socket.emit('enviarMensaje', {
    user: 'Sergio',
    message: 'Hola mundo'
}, function(resp) {
    console.log('Server response: ', resp);
});

// Listen information
socket.on('enviarMensaje', function(resp) {
    console.log('Server: ', resp);
});