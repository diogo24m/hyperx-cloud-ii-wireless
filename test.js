const hyperxCloud = require('./')({ debug: true })

hyperxCloud.on('power', (power) => console.log(`power: ${power}`))
hyperxCloud.on('muted', (status) => console.log(`muted: ${status}`))
hyperxCloud.on('volume', (direction) =>
  console.log(`volume: ${direction}`)
)
hyperxCloud.on('charging', (charging) =>
  console.log(`charging: ${charging}`)
)
hyperxCloud.on('mic', (status) =>
  console.log(`microphone: ${status}`)
)
hyperxCloud.on('battery', (percentage) =>
  console.log(`current battery: ${percentage}%`)
)
hyperxCloud.on('unknown', (data) => console.log('unknown', data))
hyperxCloud.on('error', (error) => console.error('error', error))
