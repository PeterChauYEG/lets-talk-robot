"use strict";

// Import Hardware drivers
import {
	setDrivetrain,
}
from './drv8833';

import {
	setLED,
}
from './LED';

import {
	board,
	drivetrain,
	LED,
}

from './pi';

const gpio = {
	board,
	drivetrain,
	LED,
	setDrivetrain,
	setLED,
}

export default gpio;
