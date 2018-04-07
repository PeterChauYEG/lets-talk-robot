export function setDrivetrain (drivetrain, AIN, BIN, speed) {
  // speed range is 0 - 255

  // stop
  if (AIN === 0 && BIN === 0) {
    drivetrain.ain.stop()
    drivetrain.bin.stop()
    return
  }

  if (AIN === 1 && BIN === 1) {
    drivetrain.ain.forward(speed)
    drivetrain.bin.forward(speed)
    return
  }

  if (AIN === -1 && BIN === -1) {
    drivetrain.ain.reverse(speed)
    drivetrain.bin.reverse(speed)
    return
  }

  if (AIN === 1 && BIN === -1) {
    drivetrain.ain.forward(speed)
    drivetrain.bin.reverse(speed)
    return
  }

  if (AIN === -1 && BIN === 1) {
    drivetrain.ain.reverse(speed)
    drivetrain.bin.forward(speed)
  }
}
