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
                message: 'Nombre es requerido'
            });
        }

        // El id del usuario lo obtenemos del id del objeto client - devuelve array con todos los usuarios
        let usersConected = user.addUser(client.id, data.name);
        console.log(user, 'ha entrado en el chat');

        // Cada vez que un usuario se conecta se le envía a todos los usuarios la nueva lista de usuarios
        // conectados
        client.broadcast.emit('listUsersConected', user.getUsers());

        // Cuando un usuario se conecta al chat se le devuelve un array con todos los usuarios conectados incluido
        // él mismo
        callback(usersConected);

    });

    // Cada vez que se desconecta hay que borrar el usuario para que no se dupliquen. Por ejemplo, al recargar
    // el navegador se crea una nueva instancia de socket por lo que se produce una desconexión y al conectarse
    // se crea un usuario duplicado
    client.on('disconnect', () => {

        let userDeleted = user.deleteUser(client.id);

        client.broadcast.emit('createMessage', {
            user: 'Admin',
            message: `${ userDeleted.userName } abandonó el chat`
        });
        // Cada vez que un usuario se desconecta se le envía a todos los usuarios la nueva lista de usuarios
        // conectados
        client.broadcast.emit('listUsersConected', user.getUsers());
    });

});