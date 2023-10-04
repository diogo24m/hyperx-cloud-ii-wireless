const HID = require('node-hid')

let interval
let bootstrapDevice

function bootstrap(emitter, devices, updateDelay) {
  if (!interval) {
    interval = setInterval(
      () => bootstrap(emitter, devices, updateDelay),
      updateDelay
    )
  }

  if (!bootstrapDevice) {
    const bootstrapDeviceInfo = devices.find(
      (d) => d.usagePage === 65424 && d.usage === 771
    )
    bootstrapDevice = new HID.HID(bootstrapDeviceInfo.path)
  }

  try {
    let buffer = Buffer.alloc(20)
    buffer.writeUInt32BE(0x21ff0500, 0)
    bootstrapDevice.write(buffer)
  } catch (e) {
    emitter.emit('error', e)
  }
}

module.exports = { bootstrap, interval }
