/** Module sender used to save backup file in different locations based on configuration
 * @module Sender
 */

const webdavSender = require('webdav')
const { removeFileFromDir } = require('utility/utility')

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
    // Elimino i file di backup nell'host e risolvo la promise
    putFilePromise
      .then(() => removeFileFromDir(filepath).then(() => resolve({ sended: true })))
      .catch(reject)
  })
}

module.exports = {
  sendBackup
}
