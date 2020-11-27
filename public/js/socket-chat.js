// Socket clients functions

// var to have higth compatibility
var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('userName') || !params.has('chatRoom')) {

    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var user = {
    userName: params.get('userName'),
    chatRoom: params.get('chatRoom')
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

// Send Message
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

// Listening Private messages
socket.on('privateMessage', function(message) {
    console.log('Mensaje Privado: ', message);
});