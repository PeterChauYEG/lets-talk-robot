var socket = io();

// event emitter
$('form').submit(function() {
  socket.emit('log message', $('#log-input').val());
  $('#log-input').val('');
  return false;
});

// receive the message
socket.on('log message', function(msg) {
  $('#messages').append($('<li>').text(msg));
  $('#messages').scrollTop($('#messages').height());
  return;
});

// start the stream
socket.on('liveStream', function(url) {
  $('#stream').attr('src', url);
  $('#start-stream').hide();
  return;
});

function gpio(req) {
  socket.emit('gpio', req);
  return;
}

function startStream() {
  socket.emit('start-stream');
  $('#start-stream').hide();
  return;
}