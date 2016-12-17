export function setDrivetrain(drivetrain, AIN, BIN) {
	// speed range is 0 - 255
	if (AIN == 0 && BIN == 0) {
		drivetrain.ain.stop();
		drivetrain.bin.stop();
		return;
	}

	// determine direction of motor
	const gears = {
		right: AIN == 1 ? true : false,
		left: BIN == 1 ? true : false,
	};

	// set motors
	gears.right ? drivetrain.ain.forward(AIN) : drivetrain.ain.reverse(-AIN);
	gears.left ? drivetrain.bin.forward(BIN) : drivetrain.bin.reverse(-BIN);

	return;
}
