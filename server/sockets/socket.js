const { io } = require('../server');
const { Users } = require('../classes/users');
const { sendMessage } = require('../actions/actions');

const users = new Users();

// Clients conections
io.on('connection', (client) => {

    // Escucha cuando un usuario entra al chat, añade al usuario al array de Usuarios conectados y le devuelve
    // el array al usuario que se acaba de conectar
    client.on('entryToChat', (data, callback) => {

        if (!data.userName || !data.chatRoom) {
            return callback({
                error: true,
                message: 'Nombre/sala es requerido'
            });
        }

        //Unimos el usuario a la sala
        client.join(data.chatRoom);

        // Añadimos el usuario al array dónde están todos los usuarios conectados de todas las salas. El id del usuario lo 
        // obtenemos del id del objeto client
        users.addUser(client.id, data.userName, data.chatRoom);

        // Cada vez que un usuario se conecta se le envía a todos los usuarios la sala a la que el usuario se
        // conectó nueva lista de usuarios conectados a la sala
        client.broadcast.to(data.chatRoom).emit('listUsersConected', users.getUsersByChatRoom(data.chatRoom));

        // Cuando un usuario se conecta al chat se le devuelve un array con todos los usuarios conectados a su misma sala, 
        // incluido él mismo
        callback(users.getUsersByChatRoom(data.chatRoom));

    });

    // Escuchamos cuando un usuario llama a enviar mensaje y se lo emitimos a los usuarios que están en su sala
    client.on('sendMessage', (data, callback) => {

        let user = users.getUser(client.id);

        let message = sendMessage(user.userName, data.message);
        client.broadcast.to(user.chatRoom).emit('sendMessage', message);
        // Regreso el mensaje como confirmación de que se ha enviado para gestionarlo en el frontend
        callback(message);
    });


    // Cada vez que se desconecta hay que borrar el usuario para que no se dupliquen. Por ejemplo, al recargar
    // el navegador se crea una nueva instancia de socket por lo que se produce una desconexión y al conectarse
    // se crea un usuario duplicado
    client.on('disconnect', () => {

        let userDeleted = users.deleteUser(client.id);

        // Se notifica a los clientes de su sala
        client.broadcast.to(userDeleted.chatRoom).emit('sendMessage', sendMessage('Administrador', `${ userDeleted.userName } abandonó el chat`));

        // Cada vez que un usuario se desconecta se le envía a todos los usuarios de su sala la nueva lista de usuarios
        // conectados a la sala
        client.broadcast.to(userDeleted.chatRoom).emit('listUsersConected', users.getUsersByChatRoom(userDeleted.chatRoom));
    });

    // Private messages, escucha cuando un cliente quiere mandar un mensaje privado a otro usuario, y se lo
    // envía
    client.on('privateMessage', data => {

        let userEmisor = users.getUser(client.id);
        // Enviamos el mensaje a un usuario según su id
        client.broadcast.to(data.id_receptor).emit('privateMessage', sendMessage(userEmisor.userName, data.message));
    });

});