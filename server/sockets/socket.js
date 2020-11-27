const { Socket } = require('socket.io');
const { io } = require('../server');
const { Users } = require('../classes/users');

const user = new Users();

// Clients conections
io.on('connection', (client) => {

    console.log('Usuario conectado');

    // Escucha cuando un usuario entra al chat, añade al usuario al array de Usuarios conectados y le devuelve
    // el array al usuario que se acaba de conectar
    client.on('entryToChat', (data, callback) => {

        if (!data.name) {
            return callback({
                error: true,
                message: 'Name is required'
            });
        }

        // El id del usuario lo obtenemos del id del objeto client - devuelve array con todos los usuarios
        let usersConected = user.addUser(client.id, data.name);
        console.log(user, 'ha entrado en el chat');

        // Cuando un usuario se conecta al chat se le devuelve un array con todos los usuarios conectados incluido
        // él mismo
        callback(usersConected);

    });

});