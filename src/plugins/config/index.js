import path from 'path'
import fs from 'fs'

let jsonConfig = null

/**
 * @param {string} configPath - path of the configs file (name included) (default: <root>/config.js)
 * @return {Object} - return the object with the configuration of the sender
 */
function getSenderConfig (configPath = path.join(__dirname, '..', 'config.json')) {
  if (jsonConfig === null) {
    const rawdata = fs.readFileSync(configPath)
    jsonConfig = JSON.parse(rawdata)
  }

  if (jsonConfig.sender) {
    return jsonConfig.sender
  } else {
    throw new Error('sender property is required in config.json')
  }
}

export { getSenderConfig }
