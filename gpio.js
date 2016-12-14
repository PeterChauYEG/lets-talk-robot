"use strict";

// Import Hardware drivers
import {
	drivetrain,
	setDrivetrain
}
from './drv8833';
import {
	LED,
	setLED
}
from './LED';

const gpio = {
	drivetrain,
	LED,
	setDrivetrain,
	setLED,
}
export default gpio;
