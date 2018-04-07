export function setLED (led, state) {
  switch (state) {
    case 'board-ready':
      // color yellow
      led.red.write(255)
      led.green.write(255)
      led.blue.write(0)
      return

    case 'connected-to-server':
      // color green
      led.red.write(0)
      led.green.write(255)
      led.blue.write(0)
      return

    case 'log-message':
      // color red
      led.red.write(255)
      led.green.write(0)
      led.blue.write(0)
      return

    case 'streaming':
      // color white
      led.red.write(255)
      led.green.write(255)
      led.blue.write(255)
      return

    case 'server-pipe':
      // color blue
      led.red.write(0)
      led.green.write(0)
      led.blue.write(255)
      return

    case 'board-response':
      // color purple
      led.red.write(255)
      led.green.write(0)
      led.blue.write(255)
      return

    case 'board-off':
      // led off
      led.red.write(0)
      led.green.write(0)
      led.blue.write(0)
      return

    default:
      // led off
      led.red.write(0)
      led.green.write(0)
      led.blue.write(0)
  }
}
