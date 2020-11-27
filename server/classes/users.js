class Users {

    constructor() {

        this.users = [];

    }

    // Add a person to chat
    addUser(id, userName, chatRoom) {

        let user = { id, userName, chatRoom };

        this.users.push(user);

        return this.users;
    }

    // Get user by ID
    getUser(id) {

        // Regresa un array con todos los elementos que coincidan en la condición. Cogemos el primer elemento
        // que coincida aunque sabemos que el id será único
        let user = this.users.filter(person => person.id === id)[0];

        // Si no encuentra una persona user tendrá undefined
        return user;
    }

    // Get users by ChatRoom
    getUsersByChatRoom(chatRoom) {

        let usersInChatRoom = this.users.filter(user => user.chatRoom === chatRoom);
        return usersInChatRoom;

        // // Esto es lo mismo que lo anterior
        // let usersInChatRoom = this.users.filter(user => {
        //     return user.chatRoom === chatRoom;
        // });
    }

    getUsers() {

        return this.users;
    }

    deleteUser(id) {

        let userDeleted = this.getUser(id);

        // Regresa un array con todos los usuarios menos el que coincide con el id
        this.users = this.users.filter(user => user.id != id);

        // //Esto es lo mismo que lo anterior
        // // Regresa un array con todos los usuarios menos el que coincide con el id
        // this.users = this.users.filter(user => {
        //     return user.id != id;
        // });

        return userDeleted;
    }

}

module.exports = {
    Users
}