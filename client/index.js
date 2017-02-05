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
// socket.on('liveStream', function(url) {
//   $('#stream').attr('src', url);
//   $('#start-stream').hide();
//   return;
// });

// ----------------------------
// h264 live player
var canvas = document.createElement("canvas");
document.getElementById("stream").appendChild(canvas);

// Create h264 player
const hostname = window.location.hostname;

var uri = `ws://${hostname}:8081`;
var wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
wsavc.connect(uri);

//expose instance for button callbacks
window.wsavc = wsavc;

// --------------------------------------
// W A S D controls
//
// declare keys
const keys = [64, 83, 68, 70];

// bind key down event listener to window
window.addEventListener('keypress', (e) => {
  let direction;

  switch(e.keyCode) {
    case 87:
      direction = 'forward'
      break
    case 65:
      direction = 'rotate left'
      break
    case 83:
      direction = 'backwards'
      break
    case 68:
      direction = 'rotate right'
      break
    case 32:
    default:
      direction = 'stop';
  }

  gpio(direction);
})

function gpio(req) {
  socket.emit('gpio', req);
  return;
}

function startStream() {
  socket.emit('start-stream');
  $('#start-stream').hide();
  return;
}
