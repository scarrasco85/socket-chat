var params = new URLSearchParams(window.location.search);

// Referencias de jQuery
var divUsers = $('#divUsers');

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