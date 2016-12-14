import five from 'johnny-five';

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

function setDrivetrain(drivetrain, AIN, BIN) {
	// speed range is 0 - 255
	if (AIN == 0 && BIN == 0) {
		drivetrain.ain.stop();
		drivetrain.bin.stop();
		return;
	}

	// determine direction of motor
	const gears = {
		right: AIN >= 0 ? true : false,
		left: BIN >= 0 ? true : false,
	};

	// set motors
	if (AIN == null) {
		gears.left ? drivetrain.bin.forward(BIN) : drivetrain.bin.reverse(-BIN);

	}
	else if (BIN == null) {
		gears.right ? drivetrain.ain.forward(AIN) : drivetrain.ain.reverse(-AIN);
	}
	else {
		gears.right ? drivetrain.ain.forward(AIN) : drivetrain.ain.reverse(-AIN);
		gears.left ? drivetrain.bin.forward(BIN) : drivetrain.bin.reverse(-BIN);
	}
	return;
}

export default {
	drivetrain,
	setDrivetrain
}
