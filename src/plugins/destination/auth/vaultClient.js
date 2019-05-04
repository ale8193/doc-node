/**
 * Auth Wrapper of Vault API Client
 * https://github.com/kr1sp1n/node-vault/tree/master/example
 */

import vaultAPI from 'node-vault'

const options = {
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ENDPOINT,
  token: process.env.VAULT_TOKEN
}

const vault = vaultAPI(options)
const vaultStorage = 'kv/data/doc_storage/'

export function getUser () {
  return new Promise((resolve, reject) => {
    vault.read(vaultStorage + 'user').then(result => {
      let user = result.data.data.user
      resolve(user)
    }).catch(err => reject(err))
  })
}

export function getPassword () {
  return new Promise((resolve, reject) => {
    vault.read(vaultStorage + 'password').then(result => {
      let pw = result.data.data.password
      resolve(pw)
    }).catch(err => reject(err))
  })
}
