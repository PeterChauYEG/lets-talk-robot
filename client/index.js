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

// ----------------------------
// h264 live player
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// Create h264 player
var uri = "ws://192.168.0.23:8081";
var wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
wsavc.connect(uri);

//expose instance for button callbacks
window.wsavc = wsavc;

function gpio(req) {
  socket.emit('gpio', req);
  return;
}

function startStream() {
  socket.emit('start-stream');
  $('#start-stream').hide();
  return;
}
