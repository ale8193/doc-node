/** Module sender used to save backup file in different locations based on configuration
 * @module Sender
 */

const webdavSender = require('webdav')

/**
 * Function to send a backup based on the configuration, specified in the config file
 * @param {string} filepath - path of the folder in which is saved the backup file
 * @param {string} filename - name of the backup file
 * @returns {Promise<Object>} - return a promise resolved with an object `{sended: true}`
 * module:Sender~sendBackup
 */
const sendBackup = (filepath, filename) => {
  return new Promise((resolve, reject) => {
    // Invio su webdav
    const putFilePromise = webdavSender.putFile(filepath, filename)
    // Elimino i file di backup nell'host
    /* TODO */

    putFilePromise
      .then(() => resolve({ sended: true }))
      .catch(err => reject(err))
  })
}

module.exports = {
  sendBackup
}
