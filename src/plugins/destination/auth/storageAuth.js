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
 */
const MODES = {
  ENVIRONMENT: 'environment',
  PARAMETERS: 'parameters',
  SECRETS: 'docker_secrets',
  VAULT: 'vault',
  DEFAULT: 'default'
}

const mode = process.env.STORAGE_AUTH_MODE || MODES.DEFAULT

const userGetter = {
  [MODES.ENVIRONMENT]: (resolve, reject, errorMsg) => {
    let user = process.env.BACKUP_STORAGE_USER
    user ? resolve(user) : reject(new Error(errorMsg))
  },
  [MODES.PARAMETERS]: (resolve, reject, errorMsg) => {
    let user = process.argv[3]
    user ? resolve(user) : reject(new Error(errorMsg))
  },
  [MODES.SECRETS]: (resolve, reject, errorMsg) => {
    let user = fs.readFileSync('/run/secrets/storage_user', 'utf8').trim()
    user ? resolve(user) : reject(new Error(errorMsg))
  },
  [MODES.VAULT]: (resolve, reject) => {
    vault.getUser().then(result => resolve(result)).catch(err => reject(new Error(err)))
  },
  [MODES.DEFAULT]: (resolve) => {
    resolve(defaultUser)
  }
}

const passwordGetter = {
  [MODES.ENVIRONMENT]: (resolve, reject, errorMsg) => {
    let password = process.env.BACKUP_STORAGE_PASSWORD
    password ? resolve(password) : reject(new Error(errorMsg))
  },
  [MODES.PARAMETERS]: (resolve, reject, errorMsg) => {
    let password = process.argv[4]
    password ? resolve(password) : reject(new Error(errorMsg))
  },
  [MODES.SECRETS]: (resolve, reject, errorMsg) => {
    let password = fs.readFileSync('/run/secrets/storage_password', 'utf8').trim()
    password ? resolve(password) : reject(new Error(errorMsg))
  },
  [MODES.VAULT]: (resolve, reject) => {
    vault.getPassword().then(result => resolve(result)).catch(err => reject(new Error(err)))
  },
  [MODES.DEFAULT]: (resolve) => {
    resolve(defaultPassword)
  }
}

/**
 * Function to get username to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getUser
 */
function getUser () {
  return new Promise((resolve, reject) => {
    userGetter[mode](resolve, reject, 'User not found in ' + mode)
  })
}

/**
 * Function to get password to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getPassword
 */
function getPassword () {
  return new Promise((resolve, reject) => {
    passwordGetter[mode](resolve, reject, 'Password not found in ' + mode)
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
