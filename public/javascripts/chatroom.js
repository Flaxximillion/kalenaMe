
var socket = io.connect();
var messageForm = $('#messageForm');
var message = $('#message');
var chat = $('#chat');
var users = $('#users');


function startChat(){


  messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', message.val());
    message.val('');
  });

  socket.on('new message', function(data){
    chat.append('<div class="well"><strong>'+ data.user +': </strong>'+ data.msg + '</div>');
  });

  socket.on('get users', function(data){
    var html = ''
    for (var i = 0; i < data.length; i++){
      html += '<li class="list-group-item">'+ data[i] +'</li>'
    }
    users.html(html);
  })
}

$(document).ready(function() {
  console.log( "ready!" );
  startChat();
  socket.emit('new user', 'fetch group members');
});
