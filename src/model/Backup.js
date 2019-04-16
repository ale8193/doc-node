import os from 'os'
import { dateToString } from 'utility/utility'

const options = {
  separator: '_'
}

/**
 * @class Backup class
 */
class Backup {
  /**
   * @constructs Backup
   * @param {string} containerName - name of the container that hosts the volume backuped
   * @param {string} backupName - name of the backup
   * @param {Object} opt - object containing options on the creation of the object, options are: - separator: {string} (default: '_')
   */
  constructor (containerName, backupName, opt = {}) {
    Object.assign(options, opt)

    this.containerName = containerName
    this.backupName = backupName
    this.hostname = os.hostname()
    this.createdAt = new Date()
  }

  /**
   * Method to string of the class Backup
   * @param {string} extention - string rappresenting the extension to add to the string, default value: ''
   * @returns {string} - return a string composed by: containerName, backupName, hostname and createdAt, all components are separated by the separator
   */
  toString (extention = '') {
    return this.containerName + options.separator +
      this.backupName + options.separator +
      this.hostname + options.separator +
      dateToString(this.createdAt) + extention
  }
}

module.exports = Backup
