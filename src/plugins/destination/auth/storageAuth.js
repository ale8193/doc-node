/**
 * Access storage's security informations in different modes
 * @module Sender/storageAuth
 */
import fs from 'fs'
import * as vault from './vaultClient'

const defaultUser = 'admin'
const defaultPassword = 'admin'

/**
 * Where to get the informations
 * @enum {string}
 */
const MODES = {
  ENVIRONMENT: 'environment',
  PARAMETERS: 'parameters',
  SECRETS: 'docker_secrets',
  VAULT: 'vault',
  DEFAULT: 'default'
}

/**
 * What type of information
 * @enum {string}
 */
const TYPES = {
  USER: 'username',
  PASSWORD: 'password'
}

const mode = process.env.STORAGE_AUTH_MODE || MODES.DEFAULT

/**
 * This object allows to get auth information based on modes and type resolving Promise callbacks. 
 * How to use: authGetter\[mode\](type, resolve, reject, errorMsg)
 * @function
 * @name authGetter
 * @param {string} mode - where get the information
 * @param {string} type - what type of information,
 * @param {string} resolve - the Promise resolve callback
 * @param {string} reject - the Promise reject callback
 * @param {string} errorMsg - an error message passed to reject error
 */
const authGetter = {
  [MODES.ENVIRONMENT]: (type, resolve, reject, errorMsg) => {
    let data = (type === TYPES.USER ? process.env.BACKUP_STORAGE_USER : process.env.BACKUP_STORAGE_PASSWORD)
    data ? resolve(data) : reject(new Error(errorMsg))
  },
  [MODES.PARAMETERS]: (type, resolve, reject, errorMsg) => {
    let data = (type === TYPES.USER ? process.argv[3] : process.argv[4])
    data ? resolve(data) : reject(new Error(errorMsg))
  },
  [MODES.SECRETS]: (type, resolve, reject, errorMsg) => {
    let secretField = (type === TYPES.USER ? 'storage_user' : 'storage_password')
    let data = fs.readFileSync('/run/secrets/' + secretField, 'utf8').trim()
    data ? resolve(data) : reject(new Error(errorMsg))
  },
  [MODES.VAULT]: (type, resolve, reject) => {
    let data = (type === TYPES.USER ? vault.getUser() : vault.getPassword())
    data.then(result => resolve(result)).catch(err => reject(new Error(err)))
  },
  [MODES.DEFAULT]: (type, resolve) => {
    (type === TYPES.USER ? resolve(defaultUser) : resolve(defaultPassword))
  }
}

/**
 * Function to get username to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getUser
 */
function getUser () {
  return new Promise((resolve, reject) => {
    authGetter[mode](TYPES.USER, resolve, reject, 'User not found in ' + mode)
  })
}

/**
 * Function to get password to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getPassword
 */
function getPassword () {
  return new Promise((resolve, reject) => {
    authGetter[mode](TYPES.PASSWORD, resolve, reject, 'Password not found in ' + mode)
  })
}

/**
 * Function to get token to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getToken
 */
function getToken () {
  return new Promise((resolve, reject) => {
    reject(new Error('Not implemented'))
  })
}

export {
  getUser,
  getPassword,
  getToken
}
