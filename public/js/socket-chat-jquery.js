var params = new URLSearchParams(window.location.search);

// Referencias de jQuery
var divUsers = $('#divUsers');
var formSendMessage = $('#formSendMessage');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');
var searchUser = $('#searchUser');



// Funciones encargadas de renderizar usuarios en el HTML

function renderUsers(users) { // recibe arreglo de usuarios [{}, {}, {}]

    console.log(users);

    var html = '';

    html += '<li>';
    html += `    <a href="javascript:void(0)" class="active"> Chat de <span> ${ params.get('chatRoom') }</span></a>`;
    html += '</li>';

    users.forEach(user => {
        html += '<li>';
        html += `   <a data-id="${ user.id }" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${ user.userName } <small class="text-success">online</small></span></a>`;
        html += '</li>';
    });

    divUsers.html(html);

}

// me(boolean): true if me is who send the message
function renderMessages(message, me) {
    console.log('render', message);

    var html = '';
    var date = new Date(message.date);
    var hour = date.getHours() + ':' + date.getMinutes();

    // Este inverse es el inverse que hay aquí: <div class="box bg-light-inverse">, lo pondremos en otro color si el mensaje lo manda el
    // administrador, por ejemplo: Un usario abandonó el chat
    var adminClass = 'inverse';
    if (message.userName === 'Administrador') {
        adminClass = 'danger';
    }

    if (me) {

        html += '<li class="animated fadeIn">';
        html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '    <div class="chat-content">';
        html += `        <h5>${ message.userName }</h5>`;
        html += `        <div class="box bg-light-info">${ message.message }</div>`;
        html += '    </div>';
        html += `    <div class="chat-time">${ hour }</div>`;
        html += '</li>';
    } else {

        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += `        <h5>${ message.userName }</h5>`;
        html += `        <div class="box bg-light-${adminClass}">${ message.message }</div>`;
        html += '    </div>'
        if (adminClass != 'Administrador') {
            html += `    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>`;
        }
        html += `    <div class="chat-time">${ hour }</div>`;
        html += '</li>';
    }

    divChatbox.append(html);
}

// Para mantener el scroll del cuadro de mensajes siempre abajo y se mueva solo.
// Hace calculos para ver si tiene que hacer scroll o no
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners jQuery
// Escucha el evento 'click' de cualquier elemento 'a' que haya en divUsers
divUsers.on('click', 'a', function() {

    // $(this) es sentencia de jQuery que hace referencia al elemento 'a' sobre el que se ha hecho click
    //             <a data-id=, data es una etiqueta personalizada que podría tener otro nombre, pero normalmente
    // se usa data sequido de guion y el nombre del atributo
    var id = $(this).data('id');

    // Si se hace click en el 'a' que contiene el nombre del chat no existirá id, ya que id sólo lo contienen
    // los usuarios
    if (id) {
        console.log(id);
    }

});

// Escucha evento submit del formulario que envía mensajes
formSendMessage.on('submit', function(e) {

    // Esto evita que se recarge la información cuando haga el posteo, así se trata la información pero no
    // se recarga la página
    e.preventDefault();

    // trim() elimina espacios delante y detrás. Si no hay nada escrito que no se haga nada, que no se envie.
    if (txtMessage.val().trim().length === 0) {
        return;
    }

    // Send Message
    socket.emit('sendMessage', {
        userName: params.userName,
        message: txtMessage.val()

        // Si el callback se ejecuta bien es porque en el server se ha entregado el mensaje correctamente
        // y lo estamos recibiendo a modo de confirmación, por eso no hay que poner if, con el txtMessage.val() es suficiente
    }, function(message) {
        console.log('Server response: ', message);
        // Reseteamos el texto y le damos el foco
        txtMessage.val('').focus();
        // me = true para especificar que el mensaje lo envío yo
        renderMessages(message, true)
        scrollBottom();
    });
});

searchUser.on('keyup', function() {
    console.log('Cambiado!');
    let searched = searchUser.val();

    socket.emit('search', searched, function(resp) {
        console.log('users searched: ', resp);


        // renderUsers():definida en socket-chat-jquery.js, se importa antes que este archivo en chat.html
        // por eso la detecta
        renderUsers(resp);
    });
});