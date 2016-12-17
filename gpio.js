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

const gpio = {
	setDrivetrain,
	setLED,
}

export default gpio;
