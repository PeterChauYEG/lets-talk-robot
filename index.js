// import robot api deps
import five from 'johnny-five';
import raspi from 'raspi-io';
import { SoftPWM } from 'raspi-soft-pwm';

// import hardware interfaces
import { setDrivetrain } from './drivers/drv8833';
import { setLED } from './drivers/LED';
import { startStreaming, stopStreaming } from './drivers/camera.js';

// import api deps
import express from 'express';
import { Server } from 'http';
import path from 'path';

var http = Server(app);
var io = require('socket.io')(http);
var app = express();

// setup hardware api
var sockets = {};

// config event emitters
process.setMaxListeners(11);

// Create board with gpio
const board = new five.Board({
  io: new raspi()
});

// serve stream
// app.use('/', express.static(path.join(__dirname, 'stream')));

// serve client
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Initialize board
board.on('ready', function() {

  // POLOLU DRV8833 Dual H-bridge Configuration
  const drivetrain = {

    // right motor
  	ain: new five.Motor({
  		pins: {
  			pwm: 24, // white wire // AIN2
  			dir: 2 // red wire // AIN1
  		},
  		invertPWM: true
  	}),

  	// left motor
  	bin: new five.Motor({
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

  // initialize motors
  setDrivetrain(drivetrain, 1, 1);
  setDrivetrain(drivetrain, 0, 0);

  // Set Software state LED to "board-ready"
  setLED(LED, 'board-ready');
  io.emit('log message', 'board ready');
  console.log('board ready');

  // client connection
  io.on('connection', function(socket) {

    // log total clients connected
    sockets[socket.id] = socket;
    console.log("Total clients connected : " + Object.keys(sockets).length);

    // Set Software state LED to "connected-to-server"
    setLED(LED, 'connected-to-server');
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
      setLED(LED, 'streaming');

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
      io.emit('log message', msg);
      setLED(LED, 'server-pipe');
      console.log('message: ' + msg);
    });

    // handle gpio
    socket.on('gpio', function(req) {
      switch (req) {

        case 'forward':
          setDrivetrain(drivetrain, 1, 1);
          setLED(LED, 'server-pipe');
          console.log('message: ' + req);
          break;

        case 'rotate right':
          setDrivetrain(drivetrain, -1, 1);
          setLED(LED, 'server-pipe');
          console.log('message: ' + req);
          break;

        case 'backwards':
          setDrivetrain(drivetrain, -1, -1);
          setLED(LED, 'server-pipe');
          console.log('message: ' + req);
          break;

        case 'rotate left':
          setDrivetrain(drivetrain, 1, -1);
          setLED(LED, 'server-pipe');
          console.log('message: ' + req);
          break;

        case 'stop':
        default:
          setDrivetrain(drivetrain, 0, 0);
          setLED(LED, 'server-pipe');
          console.log('message: ' + req);
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

// start listening on port 8080
http.listen(8080, function() {
  console.log('listening on *:8080');
});