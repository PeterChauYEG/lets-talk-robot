var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

import five from 'johnny-five';
import raspi from 'raspi-io';
const SoftPWM = require('raspi-soft-pwm').SoftPWM;

// import hardware interfaces
import { setDrivetrain } from './drv8833';
import { setLED } from './LED';
import { startStreaming, stopStreaming } from './camera.js';

// setup hardware api
var sockets = {};

// config event emitters
process.setMaxListeners(11);

// Create board with gpio
const board = new five.Board({
  io: new raspi()
});

app.use('/', express.static(path.join(__dirname, 'stream')));

// serve client
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Initialize board
board.on('ready', function() {

  // POLOLU DRV8833 Dual H-bridge Configuration
  const drivetrain = {
  	ain: new five.Motor({ // right motor
  		pins: {
  			pwm: 24, // white wire // AIN2
  			dir: 2 // red wire // AIN1
  		},
  		invertPWM: true
  	}),
  	bin: new five.Motor({ // left moter
  		pins: {
  			pwm: 26, // brown wire // BIN2
  			dir: 7 // black wire // BIN1
  		},
  		invertPWM: true
  	})
  };

  // Software state LED configuration
  const LED = {
  	red: new SoftPWM({
  		pin: 6,
  		range: 255,
  		frequency: 800
  	}),
  	green: new SoftPWM({
  		pin: 10,
  		range: 255,
  		frequency: 800
  	}),
  	blue: new SoftPWM({
  		pin: 11,
  		range: 255,
  		frequency: 800
  	})
  };

  io.emit('log message', 'board ready');
  console.log('board ready');

  // initialize motors
  setDrivetrain(drivetrain, 1, 1);
  setDrivetrain(drivetrain, 0, 0);

  // Set Software state LED to "board-ready"
  setLED(LED, 'board-ready');

  // Set Software state LED to "error connecting-to-server"
  setLED(LED, 'error-connecting-to-server');

  // Set Software state LED to "connected-to-server"
  setLED(LED, 'connected-to-server');

  // setdrivetrain(drivetrain, AIN, BIN);
  setLED(LED, 'board-response');

  setLED(LED, 'reconnected-to-server');
  setLED(LED, 'server-pipe');

  // client connection
  io.on('connection', function(socket) {
    sockets[socket.id] = socket;
    console.log("Total clients connected : " + Object.keys(sockets).length);

    io.emit('log message', 'a user has connected');
    console.log('a user connected');

    // client disconnection
    socket.on('disconnect', function() {
      delete sockets[socket.id];

      // if no more sockets, kill the stream
      if (Object.keys(sockets).length == 0) {
        app.set('watchingFile', false);
        stopStreaming;
      }

      io.emit('log message', 'a user has disconnected');
      console.log('user disconnected');
    });

    // to start a stream
    socket.on('start-stream', function() {
      io.emit('log message', 'starting video stream');

      if (app.get('watchingFile')) {
        io.sockets.emit('liveStream', 'image_stream.jpg?=' + (Math.random() * 100000));
      }
      else {
        startStreaming(io);
        app.set('watchingFile', true);
      }
    });

    // log message to client
    socket.on('log message', function(msg) {
      console.log('message: ' + msg);
      io.emit('log message', msg);
    });

    // handle gpio
    socket.on('gpio', function(req) {
      switch (req) {
        case 'forward':
          // motors forward
          setDrivetrain(drivetrain, 1, 1);

          console.log('message: ' + req);
          io.emit('log message', req);
          break;
        case 'rotate right':
          console.log('message: ' + req);
          io.emit('log message', req);

          // motors rotate right
          setDrivetrain(drivetrain, 1, -1);
          break;
        case 'backwards':
          console.log('message: ' + req);
          io.emit('log message', req);

          // motors reverse
          setDrivetrain(drivetrain, -1, -1);
          break;
        case 'rotate left':
          console.log('message: ' + req);
          io.emit('log message', req);

          // motors rotate left
          setDrivetrain(drivetrain, -1, 1);
          break;
        case 'stop':
        default:
          console.log('message: ' + req);
          io.emit('log message', req);

          // stop motors
          setDrivetrain(drivetrain, 0, 0);
      }
    });
  });

  // Handle board shutdown
  board.on('warn', function(event) {
    console.log(event.message + '...');
    if (event.message === 'Closing.') {

      // Turn off motors
      console.log('shutting down board...');
      setDrivetrain(drivetrain, 0, 0);

      // Set Software state LED to "board-off"
      console.log('talk to you later bae <3');
      setLED(LED, 'board-off');
    }
  });
});

http.listen(8080, function() {
  console.log('listening on *:8080');
});