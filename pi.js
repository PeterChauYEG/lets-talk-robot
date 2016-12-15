import five from 'johnny-five';
import raspi from 'raspi-io';
import SoftPWM from 'raspi-soft-pwm';

// Create board with gpio
const board = new five.Board({
  io: new raspi()
});

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

export default {
	board,
	drivetrain,
	LED,
}
