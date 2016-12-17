export function setDrivetrain(drivetrain, AIN, BIN) {
	// speed range is 0 - 255
	if (AIN == 0 && BIN == 0) {
		drivetrain.ain.stop();
		drivetrain.bin.stop();
		return;
	}

	// set motors
	AIN ? drivetrain.ain.forward(AIN) : drivetrain.ain.reverse(AIN);
	BIN ? drivetrain.ain.forward(BIN) : drivetrain.ain.reverse(BIN);
}
