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

const mode = process.env.STORAGE_AUTH_MODE || MODES.VAULT

/**
 * Function to get username to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getUser
 */
function getUser () {
  return new Promise((resolve, reject) => {
    let error = 'User not found in ' + mode
    let user
    switch (mode) {
      case MODES.ENVIRONMENT:
        user = process.env.BACKUP_STORAGE_USER
        user ? resolve(user) : reject(new Error(error))
        break
      case MODES.PARAMETERS:
        user = process.argv[3]
        user ? resolve(user) : reject(new Error(error))
        break
      case MODES.SECRETS:
        user = fs.readFileSync('/run/secrets/storage_user', 'utf8').trim()
        user ? resolve(user) : reject(new Error(error))
        break
      case MODES.VAULT:
        user = vault.getUser().then(result => resolve(result)).catch(err => reject(new Error(err)))
        break
      default:
        resolve(defaultUser)
    }
  })
}

/**
 * Function to get password to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getPassword
 */
function getPassword () {
  return new Promise((resolve, reject) => {
    let error = 'Password not found in ' + mode
    let password
    switch (mode) {
      case MODES.ENVIRONMENT:
        password = process.env.BACKUP_STORAGE_PASSWORD
        password ? resolve(password) : reject(new Error(error))
        break
      case MODES.PARAMETERS:
        password = process.argv[4]
        password ? resolve(password) : reject(new Error(error))
        break
      case MODES.SECRETS:
        password = fs.readFileSync('/run/secrets/storage_password', 'utf8').trim()
        password ? resolve(password) : reject(new Error(error))
        break
      case MODES.VAULT:
        password = vault.getPassword().then(result => resolve(result)).catch(err => reject(new Error(err)))
        break
      default:
        resolve(defaultPassword)
    }
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
