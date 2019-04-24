/**
 * Auth Wrapper of Vault API Client
 * https://github.com/kr1sp1n/node-vault/tree/master/example
 */

const options = {
  apiVersion: 'v1',
  endpoint: 'http://192.168.210.138:8200',
  token: process.env.TOKEN // TODO better?
}

const vault = require('node-vault')(options)

const getUser = () => {
  return new Promise((resolve, reject) => {
    vault.read('kv/data/doc_storage/user').then(result => {
      let user = result.data.data.user
      resolve(user)
    }).catch(err => {
      reject(err)
    })
  })
}

const getPassword = () => {
  return new Promise((resolve, reject) => {
    vault.read('kv/data/doc_storage/password').then(result => {
      let pw = result.data.data.password
      resolve(pw)
    }).catch(err => {
      reject(err)
    })
  })
}

export {
  getUser,
  getPassword
}
