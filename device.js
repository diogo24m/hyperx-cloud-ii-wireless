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
          if (statusInfo === 0x20) {
            emitter.emit('mic', statusValue == 0 ? 'off' : 'on')
            break
          }
          /*
            const chargeState = data[3]
            const magicValue = data[4] || chargeState
  
            function calculatePercentage() {
              if (chargeState === 0x10) {
                emitter.emit('charging', magicValue >= 20)
  
                if (magicValue <= 11) {
                  return 100
                }
              }
  
              if (chargeState === 0xf) {
                if (magicValue >= 130) {
                  return 100
                }
  
                if (magicValue < 130 && magicValue >= 120) {
                  return 95
                }
  
                if (magicValue < 120 && magicValue >= 100) {
                  return 90
                }
  
                if (magicValue < 100 && magicValue >= 70) {
                  return 85
                }
  
                if (magicValue < 70 && magicValue >= 50) {
                  return 80
                }
  
                if (magicValue < 50 && magicValue >= 20) {
                  return 75
                }
  
                if (magicValue < 20 && magicValue > 0) {
                  return 70
                }
              }
  
              if (chargeState === 0xe) {
                if (magicValue < 250 && magicValue > 240) {
                  return 65
                }
  
                if (magicValue < 240 && magicValue >= 220) {
                  return 60
                }
  
                if (magicValue < 220 && magicValue >= 208) {
                  return 55
                }
  
                if (magicValue < 208 && magicValue >= 200) {
                  return 50
                }
  
                if (magicValue < 200 && magicValue >= 190) {
                  return 45
                }
  
                if (magicValue < 190 && magicValue >= 180) {
                  return 40
                }
  
                if (magicValue < 179 && magicValue >= 169) {
                  return 35
                }
  
                if (magicValue < 169 && magicValue >= 159) {
                  return 30
                }
  
                if (magicValue < 159 && magicValue >= 148) {
                  return 25
                }
  
                if (magicValue < 148 && magicValue >= 119) {
                  return 20
                }
  
                if (magicValue < 119 && magicValue >= 90) {
                  return 15
                }
  
                if (magicValue < 90) {
                  return 10
                }
              }
  
              return null
            }
  
            const percentage = calculatePercentage()
            if (percentage) {
              emitter.emit('battery', percentage)
            } */
          break
        default:
          emitter.emit('unknown', data)
      }
    })
  })
}

module.exports = { deviceEmitter }
