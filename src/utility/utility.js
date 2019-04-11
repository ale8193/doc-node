/** Utility methods module
 * @module Utility
 */
import fs from 'fs'
import path from 'path'
const fsPromises = fs.promises

/**
 * Function to convert a date into a human readable string (`DD-MM-YYYY-HH-mm-ss`)
 * @param {Object} date - date object
 * @returns {string} - return a string of the date
 * module:Utility~dateToString
 */
const dateToString = date => {
  let hour = date.getHours()
  hour = (hour < 10 ? '0' : '') + hour

  let min = date.getMinutes()
  min = (min < 10 ? '0' : '') + min

  let sec = date.getSeconds()
  sec = (sec < 10 ? '0' : '') + sec

  let year = date.getFullYear()

  let month = date.getMonth() + 1
  month = (month < 10 ? '0' : '') + month

  let day = date.getDate()
  day = (day < 10 ? '0' : '') + day

  return day + '-' + month + '-' + year + '-' + hour + '-' + min + '-' + sec
}

/**
 * Function to create a folder if not exist
 * @param {string} path - the path of the folder to create
 */
const createDirectory = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

/**
 * Remove all files inside a directory
 * @param {string} directory - directory path
 * @returns {Promise} - return a Promise resolved when the directory is empty
 */
const removeFileFromDir = directory => {
  return new Promise((resolve, reject) => {
    fsPromises.readdir(directory)
      .then(files => {
        const filesRemoved = files.map(file => fsPromises.unlink(path.join(directory, file)))
        Promise.all(filesRemoved)
          .then(resolve({ empty: true }))
      })
      .catch(reject)
  })
}

export {
  dateToString,
  createDirectory,
  removeFileFromDir
}
