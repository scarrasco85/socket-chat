// Función para enviar mensajes a los usuarios
const sendMessage = (userName, message) => {

    return {
        userName,
        message,
        date: new Date().getTime()
    };
}

module.exports = {
    sendMessage
}