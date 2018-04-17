# Lets Talk Robot

## Raspberry Setup
### OS Setup
Download the latest OS image and burn it to an SD card

### Connection to the robot
Set up your Raspberry Pi's host and password then ssh into it.

### Setup RSA Key pair
Setup the RSA key pair on the client machine: `ssh-keygen -t rsa`

The generated keys should be located at `/home/<user>/.ssh/id_rsa.pub` and `/home/<user>/.ssh/id_rsa`

Copy the key into the new machine: `ssh-copy-id pi@lets-talk.local`

----------------------------------------

## Drivetrain
1. Clone this repo
2. Install with: `yarn install`
3. copy the `.env.template` as `.env` and set your environment vars

NOTE: Installation will only work on ARM processors

### Development
1. Start with: `npm start`

### Drivetrain script -> /usr/sbin/drivetrain.sh
`cd /home/<user>/robot && npm start`

remember to give it permissions to run: `sudo chmod +x /usr/sbin/drivetrain.sh`

copy the `.env.template` to `.env` and set the environment variables

-----------------------------------------------

## Webcam
Watch at: `http://192.168.0.22:9090/test.mjpg`

Stop it with:
`netstat -tulnap`
`sudo fuser -k 9090/tcp`

The best resolution I can get is 320x240 with a 1 sec delay

### ffserver -> config /etc/ffserver.conf
```
HTTPPort 9090
HTTPBindAddress 0.0.0.0
MaxHTTPConnections 1000
MaxClients 10
MaxBandwidth 1000
NoDefaults

<Feed feed1.ffm>
        File /tmp/feed1.ffm
        FileMaxSize 10M
</Feed>

<Stream test.mjpg>
        Format mpjpeg
        Feed feed1.ffm
        VideoFrameRate 4
        VideoBitRate 80
        VideoSize 600x480
        VideoIntraOnly
        NoAudio
        Strict -1
        ACL allow 127.0.0.1
        ACL allow localhost
        ACL allow 192.168.0.0 192.168.255.255
</Stream>
```

### Web cam script -> /usr/sbin/webcam.sh
`ffserver -f /etc/ffserver.conf & ffmpeg -v verbose -r 5 -s 600x480 -f video4linux2 -i /dev/video0 http://localhost:9090/feed1.ffm`

remember to give it permissions to run: `sudo chmod +x /usr/sbin/webcam.sh`

### Ngrok the video stream
Create an introspective tunnel out into the internet: `./ngrok http -region us -subdomain=lets-talk 9090`

----------------------------
## Startup
1. turn on robot power
2. ssh in to the robot
3. start robot drivetrain: `/usr/sbin/drivetrain.sh`
4. start Video Stream: `/usr/sbin/webcam.sh`
4. point your browser to: `lets-talk.local:8080` || `192.168.0.22:8080`

----------------------------
## Appendix
### Drivetrain
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

Motors initialized forward and stopped

### PWM Control of Motor Speed
| xIN1  | xIN2        | FUNCTION   |
| ----- | ----------- | ---------- |
| PWM 0 | Forward PWM | fast decay |
| 1 PWM | Forward PWM | slow decay |
| 0 PWM | Reverse PWM | fast decay |
| PWM 1 | Reverse PWM | slow decay |

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
