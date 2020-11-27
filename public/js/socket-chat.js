// Socket clients functions

// var to have higth compatibility
var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name')) {

    window.location = 'index.html';
    throw new Error('Name is required');
}

var user = {
    name: params.get('name')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    // Cuando un usuario se conecta al chat se recibe una callback con una respuesta donde viene un array con
    // todos los usuarios conectados
    // Solicita que un usuario entre al chat
    socket.emit('entryToChat', user, function(resp) {
        console.log('users conected: ', resp);
    });
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

// Listen Mensajes
socket.on('sendMessage', function(resp) {
    console.log('Usuario: ', resp.userName);
    console.log('Dice: ', resp.message);
    console.log('Hora: ', resp.date);
});

// Escuchar cuando un usuario entra o sale del chat
socket.on('listUsersConected', function(listUsers) {
    console.log('Servidor responde, nueva lista de usuarios: ', listUsers);
});