# hyperx-cloud-ii-wireless

Supports Windows 10 x64 and Linux following the instructions.

Current functionality:

- Power state
- Microphone state
- Volume state
- Charging state
- Battery percentage

## Usage

```js
const hyperxCloud = require('hyperx-cloud-ii-wireless')()

hyperxCloud.on('power', state) // 'on' | 'off'
hyperxCloud.on('muted', muted) // Boolean
hyperxCloud.on('volume', direction) // 'up' | 'down'
hyperxCloud.on('charging', charging) // Boolean
hyperxCloud.on('battery', percentage) // 0-100 | null
hyperxCloud.on('error', error) // instanceof Error
```

## Notes

The battery percentage is only an estimate based on the "status" report.

## Linux support

To work with linux it is necessary to run as root, or define rules for udev.

```
echo 'KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"' | sudo tee -a /etc/udev/rules.d/99-hidraw-permissions.rules && sudo udevadm control --reload-rules
```

disconnect and reconnect the device

## License

MIT © [Søren Brokær](https://srn.io)
