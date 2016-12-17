var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

import five from 'johnny-five';
import raspi from 'raspi-io';
const SoftPWM = require('raspi-soft-pwm').SoftPWM;

// import hardware interfaces
var gpio = require('./gpio');
var camera = require('./camera.js');

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
      camera.stopStreaming();
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
      camera.startStreaming(io);
      app.set('watchingFile', true);
    }

  });

  // log message to client
  socket.on('log message', function(msg) {
    console.log('message: ' + msg);
    io.emit('log message', msg);
  });

  // drive gpio
  socket.on('gpio', function(req) {

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

      // initialize motors
      gpio.setdrivetrain(drivetrain, 1, 1);
      gpio.setdrivetrain(drivetrain, 0, 0);

      // Set Software state LED to "board-ready"
      gpio.setLED(LED, 'board-ready');

      // Set Software state LED to "error connecting-to-server"
      gpio.setLED(LED, 'error-connecting-to-server');

      // Set Software state LED to "connected-to-server"
      gpio.setLED(LED, 'connected-to-server');

      // gpiO.setdrivetrain(drivetrain, AIN, BIN);
      gpio.setLED(LED, 'board-response');

      gpio.setLED(LED, 'reconnected-to-server');
      gpio.setLED(LED, 'server-pipe');

      // handle gpio
      socket.on('gpio', function(req) {
        switch (req) {
          case 'forward':
            console.log('message: ' + req);
            io.emit('log message', req);

            // motors forward
            gpio.setdrivetrain(drivetrain, 1, 1);
            break;
          case 'rotate right':
            console.log('message: ' + req);
            io.emit('log message', req);

            // motors rotate right
            gpio.setdrivetrain(drivetrain, 1, 0);
            break;
          case 'reverse':
            console.log('message: ' + req);
            io.emit('log message', req);

            // motors reverse
            gpio.setdrivetrain(drivetrain, 1, 1);
            break;
          case 'rotate left':
            console.log('message: ' + req);
            io.emit('log message', req);

            // motors rotate left
            gpio.setdrivetrain(drivetrain, 0, 1);
            break;
          case 'stop':
          default:
            console.log('message: ' + req);
            io.emit('log message', req);

            // stop motors
            gpio.setdrivetrain(drivetrain, 0, 0);
        }
      });

      // Handle board shutdown
      board.on('warn', function(event) {
        console.log(event.message + '...');
        if (event.message === 'Closing.') {

          // Turn off motors
          console.log('shutting down board...');
          gpio.setdrivetrain(drivetrain, 0, 0);

          // Set Software state LED to "board-off"
          console.log('talk to you later bae <3');
          gpio.setLED(LED, 'board-off');
        }
      });
    });
  });
});

http.listen(8080, function() {
  console.log('listening on *:8080');
});