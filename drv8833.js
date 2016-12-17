export function setDrivetrain(drivetrain, AIN, BIN) {
	// speed range is 0 - 255

	// stop
	if (AIN == 0 && BIN == 0) {
		drivetrain.ain.stop();
		drivetrain.bin.stop();
		return;
	}

	if (AIN == 1 && BIN == 1) {
		drivetrain.ain.forward(255);
		drivetrain.bin.forward(255);
		return;
	}

	if (AIN == 1 && BIN == 0) {
		drivetrain.ain.forward(255);
		drivetrain.bin.reverse(255);
		return;
	}

	if (AIN == 0 && BIN == 1) {
		drivetrain.ain.reverse(255);
		drivetrain.bin.forward(255);
		return;
	}

	return;
}