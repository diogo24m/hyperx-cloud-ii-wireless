const HID = require('node-hid')
const Emittery = require('emittery')
const { deviceEmitter } = require('./device')

module.exports = ({
  VENDOR_ID = 1008,
  PRODUCT_ID = 1686,
  debug = false,
  updateDelay = 5 * 1000 * 60,
} = {}) => {
  const platform = process.platform
  if (platform == 'win32' || platform == 'win64') {
    HID.setDriverType('libusb')
  }

  const emitter = new Emittery()

  const devices = HID.devices().filter(
    (d) => d.vendorId === VENDOR_ID && d.productId === PRODUCT_ID
  )

  if (devices.length === 0) {
    throw new Error('HyperX Cloud II Wireless was not found')
  }

  deviceEmitter(emitter, devices, debug, updateDelay)

  return emitter
}
