var params = new URLSearchParams(window.location.search);

// Referencias de jQuery
var divUsers = $('#divUsers');
var formSendMessage = $('#formSendMessage');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');



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

function renderMessages(message) {
    console.log('render', message);

    var html = '';

    html += '<li class="animated fadeIn">';
    html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    html += '    <div class="chat-content">';
    html += `        <h5> ${ message.userName }</h5>`;
    html += `        <div class="box bg-light-info">${ message.message }</div>`;
    html += '    </div>';
    html += '    <div class="chat-time">10:56 am</div>';
    html += '</li>';

    divChatbox.append(html);
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
    if (txtMessage.val().trim().lenght === 0) {
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
        renderMessages(message)
    });
});