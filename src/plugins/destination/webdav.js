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

let client = null

const config = {}

/**
 * Function to init the webdav client, should be initialized to establish the connection with the server.
 * The init function create also the backup root folder of the webdav server, where backups will be saved
 * @param {string} username - username to access the webdav server
 * @param {string} password - password to access the webdav server
 * @param {Object} options - object with configuration to init the client, must contain:
 *  - `host` the webdav complete host url (ex. `http://localhost:8888/webdav`)
 *  - `path` the path to use as root for the backups (ex. `/backup`)
 * @returns {Promise} - return a promise resolved when the initialization process is complete, rejected otherwise
 * module:Sender/webdav~init
 */
function init (username, password, options) {
  return new Promise((resolve, reject) => {
    if (!options.host || !options.path) {
      reject(new Error('Options object must have host and path value'))
    }

    // The client has already been initialized, nothing necessary to be done
    if (client && config.path) {
      return resolve(true)
    }

    // Init the client
    client = createClient(
      options.host,
      {
        username,
        password
      }
    )

    // Save the config about the basepath
    config.path = options.path

    // Init the basepath
    initBaseDirectory(options.path).then(resolve(true)).catch(reject)
  })
}

/**
 * Function to create the basepath into the webdav server (the location is specified in the configuration file)
 * @param {string} dirPath - path of the folder to create as basepath
 * @throws Will throw an error if the webdav client has not been initialized.
 * @returns {Promise}
 * module:Sender/webdav~initBaseDirectory
 */
function initBaseDirectory (dirPath) {
  if (!client) {
    throw new Error('Client object not initialized')
  }
  return client.createDirectory(dirPath)
}

/**
 * Put a file inside the webdav server
 * @param {string} filepath - path of the folder in which is saved the backup file
 * @param {string} filename - name of the backup file
 * @throws Will throw an error if the webdav client has not been initialized.
 * @returns {Promise}
 * module:Sender/webdav~putFile
 */
function putFile (filepath, filename) {
  return new Promise((resolve, reject) => {
    if (!client) {
      reject(new Error('Client object not initialized'))
    }
    // Join the filepath with the filename
    const fileCompletePath = path.join(filepath, filename)
    // Get the stats of the file because contain the size of the file
    const stats = fs.statSync(fileCompletePath)

    const fileReadStream = fs.createReadStream(fileCompletePath)
      .on('error', reject)
    const fileWriteStream = client.createWriteStream(path.join(config.path, filename), { maxContentLength: stats.size })
      .on('error', reject)

    fileReadStream.pipe(fileWriteStream)
      .on('finish', resolve)
  })
}

export {
  init,
  initBaseDirectory,
  putFile
}
