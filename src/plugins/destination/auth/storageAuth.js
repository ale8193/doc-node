/** 
 * Access storage's security informations in different modes
 * @module Sender/storageAuth
 */
import fs from 'fs'
import * as vault from 'auth/vaultClient'

const defaultUser = 'admin'
const defaultPassword = 'admin'
const defaultToken = 'token'

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

// TODO config file?
const mode = process.env.STORAGE_AUTH_MODE|| process.argv[2] || MODES.DEFAULT

/**
 * Function to get username to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getUser
 */
const getUser = () => {
  return new Promise((resolve, reject) => {
    let error = 'User not found in ' + mode
    let user
    switch (mode) {
      case MODES.ENVIRONMENT:
        user = process.env.BACKUP_STORAGE_USER
        user ? resolve(user) : reject(new Error(error))
        break;
      case MODES.PARAMETERS:
        user = process.argv[3]
        user ? resolve(user) : reject(new Error(error))
        break;
      case SECRETS:
        user =  fs.readFileSync('/run/secrets/storage_user', 'utf8').trim()
        user ? resolve(user) : reject(new Error(error))
        break;
      case MODES.VAULT:
        user = vault.getUser().then(result => resolve(result)).catch(err => reject(new Error(error)))
        break;
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
const getPassword = () => {
  return new Promise((resolve, reject) => {
    
  })
}

/**
 * Function to get token to access backup storage backend
 * @returns {Promise}
 * module:Sender/storageAuth~getToken
 */
const getToken = () => {
  return new Promise((resolve, reject) => {
    reject(new Error('Not implemented'))
  })
}

export {
  getUsername,
  getPassword,
  getToken
}

