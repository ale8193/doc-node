/** Module sender used to save backup file in different locations based on configuration
 * @module Sender
 */

import * as webdavSender from 'plugins/destination/webdav'
import * as storageAuth from 'plugins/destination/auth/storageAuth'
import { removeFile } from 'utility/utility'
import path from 'path'

const config = {
  webdav: {
    host: 'http://localhost:8888/webdav',
    path: '/backup'
  }
}

function initConfig () {
  return new Promise((resolve, reject) => {
    let userPromise = storageAuth.getUser()
      .then(user => {
        config.webdav.user = user
      })
      .catch(err => reject(err))
    let passwordPromise = storageAuth.getPassword()
      .then(password => {
        config.webdav.password = password
      })
      .catch(err => reject(err))

    Promise.all([userPromise, passwordPromise])
      .then(resolve(true))
      .catch(err => reject(err))
  })
}

/**
 * Function to send a backup based on the configuration, specified in the config file
 * @param {string} filepath - path of the folder in which is saved the backup file
 * @param {string} filename - name of the backup file
 * @returns {Promise<Object>} - return a promise resolved with an object `{sended: true}`
 * module:Sender~sendBackup
 */
function sendBackup (filepath, filename) {
  return new Promise((resolve, reject) => {
    let initPromise = initConfig()
      .then(() => {
        // User and password getted can config webdav
        return webdavSender.init(config.webdav.user, config.webdav.password, {
          host: config.webdav.host,
          path: config.webdav.path
        })
      })

    initPromise.then(() => {
      // Webdav configured, can send the backups
      webdavSender.putFile(filepath, filename)
        .then(() =>
          // File is sent, I can remove the backup from the host and resolve the promise
          removeFile(path.join(filepath, filename))
            .then(() => resolve({ sended: true }))
            .catch(reject)
        )
        .catch(reject)
    })
  })
}

export {
  sendBackup
}
