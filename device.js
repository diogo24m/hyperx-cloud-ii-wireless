const HID = require('node-hid')
const { bootstrap, interval } = require('./bootstrap')

function deviceEmitter(emitter, devices = [], debug, updateDelay) {
  bootstrap(emitter, devices, updateDelay)

  devices.forEach((deviceInfo) => {
    const device = new HID.HID(deviceInfo.path)

    emitter.on('close', () => device.close())

    device.on('error', (err) => emitter.emit('error', err))

    device.on('data', (data) => {
      if (debug) console.log(new Date(), data, `length: ${data.length}`)

      switch (data.length) {
        case 0x2:
          if (data[0] === 0x64 && data[1] == 0x3) {
            clearInterval(interval)
            interval = null

            return emitter.emit('power', 'off')
          }

          if (data[0] === 0x64 && data[1] == 0x1) {
            bootstrap(emitter, devices, updateDelay)

            return emitter.emit('power', 'on')
          }

          const isMuted = data[0] === 0x65 && data[1] === 0x04
          emitter.emit('muted', isMuted)
          break
        case 0x5:
          const volumeDirectionValue = data[1]
          const volumeDirection =
            volumeDirectionValue === 0x01
              ? 'up'
              : volumeDirectionValue === 0x02
              ? 'down'
              : null

          if (!volumeDirection) {
            return
          }

          emitter.emit('volume', volumeDirection)
          break
        case 0xf:
        case 0x14:
          const statusInfo = data[3]
          const statusValue = data[4]

          if (statusInfo === 0x02) {
            const percentage = data[7].toString()
            emitter.emit('battery', percentage)
            break
          }

          if (statusInfo === 0x03) {
            emitter.emit('charging', statusValue == 0 ? 'off' : 'on')
            break
          }

          if (statusInfo === 0x20) {
            emitter.emit('mic', statusValue == 0 ? 'on' : 'off')
            break
          }

          if (statusInfo === 0x21) {
            emitter.emit('monitoring', statusValue == 0 ? 'off' : 'on')
            break
          }

          break
        default:
          emitter.emit('unknown', data)
      }
    })
  })
}

module.exports = { deviceEmitter }
