// import robot deps
import five from 'johnny-five';
import raspi from 'raspi-io';

// import deps
import io from 'socket.io-client'

// import hardware interfaces
import { setDrivetrain } from './drivers/drv8833';

// setup hardware api
var sockets = {};

// setup socket
const socket = io('192.168.0.19:8080')

// Create board with gpio
const board = new five.Board({
  io: new raspi()
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

  // initialize motors
  setDrivetrain(drivetrain, 1, 1);
  setDrivetrain(drivetrain, 0, 0);

  socket.emit('log message', 'board ready');
  console.log('ready')

  // handle gpio
  socket.on('gpio', function(msg) {
    switch (msg) {

      case 'forward':
        setDrivetrain(drivetrain, 1, 1);
        console.log('gpio: ' + msg);
        break;

      case 'right':
        setDrivetrain(drivetrain, -1, 1);
        console.log('gpio: ' + msg);
        break;

      case 'backward':
        setDrivetrain(drivetrain, -1, -1);
        console.log('gpio: ' + msg);
        break;

      case 'left':
        setDrivetrain(drivetrain, 1, -1);
        console.log('gpio: ' + msg);
        break;

      case 'stop':
      default:
        setDrivetrain(drivetrain, 0, 0);
        console.log('gpio: ' + msg);
    }
  });
});
