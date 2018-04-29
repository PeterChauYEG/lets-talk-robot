// env vars
import dotenv from 'dotenv'

// import robot deps
import five from 'johnny-five'
import raspi from 'raspi-io'

// import deps
import io from 'socket.io-client'
import request from 'request'
import xmlhttprequest from 'xmlhttprequest'

// import hardware interfaces
import { setDrivetrain } from './drivers/drv8833'

// config env vars
dotenv.config()

// cookie container
var j = request.jar()

/*
 *  First I will patch the xmlhttprequest library that socket.io-client uses
 *  internally to simulate XMLHttpRequest in the browser world.
 */
var originalRequest = require('xmlhttprequest').XMLHttpRequest;

require('xmlhttprequest').XMLHttpRequest = function(){
  originalRequest.apply(this, arguments);
  this.setDisableHeaderCheck(true);
  var stdOpen = this.open;

  /*
   * I will patch now open in order to set my cookie from the jar request.
   */
  this.open = function() {
    stdOpen.apply(this, arguments);
    var header = j.get({ url: process.env.API })
      .map(function (c) {
        return c.name + "=" + c.value;
      }).join("; ");
    this.setRequestHeader('cookie', header);
  };
};

var data = {
  username: 'test',
  password: 'test'
}

// log into the api
var options = {
  body: JSON.stringify(data),
  jar: j,
  uri: process.env.API + '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

request(options, function (error, response, body) {
  if (error) {
    console.log({ error })
    return
  }

  console.log({ body })
  // setup socket
  const socket = io(process.env.API)

  // Create board with gpio
  const board = new five.Board({
    io: new raspi() /* eslint-disable-line */
  })

  // Initialize board
  board.on('ready', function () {
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
    }

    // initialize motors
    setDrivetrain(drivetrain, 1, 1)
    setDrivetrain(drivetrain, 0, 0)

    // report status
    socket.emit('robot status', 'online')
    console.log('robot online')

    // handle gpio
    socket.on('gpio', function (msg) {
      switch (msg) {
        case 'boost':
          setDrivetrain(drivetrain, 1, 1, 255)
          break

        case 'forward':
          setDrivetrain(drivetrain, 1, 1, 128)
          break

        case 'right':
          setDrivetrain(drivetrain, -1, 1, 128)
          break

        case 'backward':
          setDrivetrain(drivetrain, -1, -1, 128)
          break

        case 'left':
          setDrivetrain(drivetrain, 1, -1, 128)
          break

        case 'stop':
        default:
          setDrivetrain(drivetrain, 0, 0)
      }
      console.log('gpio: ' + msg)
    })

    // board shutdown
    this.on('exit', function () {
      // report status
      socket.emit('robot status', 'offine')
      console.log('robot offline')
    })
  })
})
