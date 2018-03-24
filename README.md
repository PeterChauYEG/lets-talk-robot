# lets-talk-robot

## LEDS
Used to signal various software states:
- board ready - yellow - pin 11
- connected to server - green
- reconnected to server - white
- error connecting to server - red

## Drivetrain
2-wheel differential drivetrain powered by two(2) - 5v DC motors, which is routed into a POLOLU DRV8833 Dual H-bridge IC. The DRV8833 addresses these motors as AIN and BIN (leftside, birdeye view, with the bot pointed away from your viewpoint).

BOUT1 - blue wire // red wire // leftside
BOUT2 - green wire // black wire // leftside
AOUT2 - orange wire // red wire // rightside
AOUT1 - yellow wire // black wire // rightside


```
	// POLOLU DRV8833 Dual H-bridge Configuration
	AIN = new five.Motor({
		pins: {
			pwm: 24, // white wire // AIN2
			dir: 2 // red wire // AIN1
		},
	});

	BIN = new five.Motor({
		pins: {
			pwm: 26, // brown wire // BIN2
			dir: 7 // black wire // BIN1
		},
	});
```

NOTE: that the raspberry pi 2 only has 2 PWM channels.

Motors initialized forward and stoped

## REPL
**AIN**
Right motor control. Inverted.

**BIN**
Left motor control. Inverted.

**start()**
start motors

**forward(speed)**
speed range is 0 - 255 (defaults to 255)
drive forward at max speed

**stop()**
stop motors

**reverse(speed)**
speed range is 0 - 255 (defaults to 255)
drive backwards at max speed

**left(speed)**
speed range is 0 - 255 (defaults to 255)
rotate left (CCW) in place at max speed

**right(speed)**
speed range is 0 - 255 (defaults to 255)
rotate right (CW) in place at max speed

## Appendix

### Libraries
[raspi-io](https://github.com/nebrius/raspi-io)
[johnny-five](https://github.com/nebrius/raspi-io)
[motor api](http://johnny-five.io/api/motor/)
[node](https://nodejs.org/en/)
[npm](https://www.npmjs.com/)
[ddp](https://www.npmjs.com/package/ddp)
[raspi-soft-pwm](https://www.npmjs.com/package/raspi-soft-pwm)

### Datasheets
[Model A+/B+/Raspberry Pi 2/Raspberry Pi Zero Pin Mapping](https://github.com/nebrius/raspi-io/wiki/Pin-Information#p1-header-2)
[DRV8833 Pin Diagram](https://a.pololu-files.com/picture/0J3867.600.png?e95f72106f0a07ceaea36a6337a52201)
[DRV8833 Datasheet](https://www.pololu.com/file/0J534/drv8833.pdf)

### Tables

Table 2. PWM Control of Motor Speed
xIN1  xIN2 FUNCTION
PWM 0 Forward PWM, fast decay
1 PWM Forward PWM, slow decay
0 PWM Reverse PWM, fast decay
PWM 1 Reverse PWM, slow decay
