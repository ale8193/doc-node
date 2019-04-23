/**
 * Auth Wrapper of Vault API Client
 * https://github.com/kr1sp1n/node-vault/tree/master/example
 */

const options = {
  endpoint: 'http://127.0.0.1',
  options: process.env.TOKEN
}

const vault = require('node-vault')(options)

const getUser = () => vault.read('secret/doc_storage/user')

const getPassword = () => vault.read('secret/doc_storage/password')

export {
  getUser,
  getPassword
}

