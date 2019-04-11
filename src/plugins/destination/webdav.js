/** Module sender used to save backup file in a webdav server.
 * In configuration file it is necessary to set the following information about the webdav server:
 *  - `webdav.host`: host of the webdav server (example: `http://localhost:8888/webdav`)
 *  - `webdav.user`: user for authorization
 *  - `webdav.password`: password for authentication
 *  - `webdav.path`: the folder inside the webdav server in which save the backup files
 * @module Sender/webdav
 */

import { createClient } from 'webdav'
import fs from 'fs'
import path from 'path'

const config = {
  webdav: {
    host: 'http://localhost:8888/webdav',
    path: '/backup',
    user: 'admin',
    password: 'admin'
  }
}

/* TODO Far vedere ad Eugenio come fargli arrivare user e password in maniera pulita */
const client = createClient(
  config.webdav.host,
  {
    username: config.webdav.user,
    password: config.webdav.password
  }
)

/**
 * Function to create the basepath into the webdav server (the location is specified in the configuration file)
 * @returns {Promise}
 * module:Sender/webdav~initBaseDirectory
 */
const initBaseDirectory = () => {
  return client.createDirectory(config.webdav.path)
}

// Init the base directory
initBaseDirectory()

/**
 * Put a file inside the webdav server
 * @param {string} filepath - path of the folder in which is saved the backup file
 * @param {string} filename - name of the backup file
 * @returns {Promise}
 * module:Sender/webdav~putFile
 */
const putFile = (filepath, filename) => {
  return new Promise((resolve, reject) => {
    // Join the filepath with the filename
    const fileCompletePath = path.join(filepath, filename)
    // Get the stats of the file because contain the size of the file
    const stats = fs.statSync(fileCompletePath)

    const fileReadStream = fs.createReadStream(fileCompletePath)
      .on('error', reject)
    const fileWriteStream = client.createWriteStream(path.join(config.webdav.path, filename), { maxContentLength: stats.size })
      .on('error', reject)

    fileReadStream.pipe(fileWriteStream)
      .on('finish', resolve)
  })
}

export {
  initBaseDirectory,
  putFile
}
