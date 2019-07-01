/** Module sender used to save backup file in different locations based on configuration
 * @module Sender
 */

import * as webdavSender from 'plugins/destination/webdav'
import * as storageAuth from 'plugins/destination/auth/storageAuth'
import { removeFileFromDir } from 'utility/utility'

const config = {
  webdav: {
    host: 'http://localhost:8888/webdav',
    path: '/backup'
  }
}

function initConfig () {
  config.webdav.user = storageAuth.getUser().then(result => { return result }).catch(err => console.log(err))
  config.webdav.password = storageAuth.getPassword().then(result => { return result }).catch(err => console.log(err))
}

initConfig()

/**
 * Function to send a backup based on the configuration, specified in the config file
 * @param {string} filepath - path of the folder in which is saved the backup file
 * @param {string} filename - name of the backup file
 * @returns {Promise<Object>} - return a promise resolved with an object `{sended: true}`
 * module:Sender~sendBackup
 */
function sendBackup (filepath, filename) {
  return new Promise((resolve, reject) => {
    // Init the webdav sender
    webdavSender.init(config.webdav.user, config.webdav.password, {
      host: config.webdav.host,
      path: config.webdav.path
    })
      .then(() => {
        // Invio su webdav
        const putFilePromise = webdavSender.putFile(filepath, filename)
        // Elimino i file di backup nell'host e risolvo la promise
        putFilePromise
          .then(() =>
            removeFileFromDir(filepath)
              .then(() => resolve({ sended: true }))
          )
          .catch(reject)
      })
      .catch(reject)
  })
}

export {
  sendBackup
}
