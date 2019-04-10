/** Utility methods module
 * @module Utility
 */
const fs = require('fs')

/**
 * Function to convert a date into a human readable string (`DD-MM-YYYY-HH-mm-ss`)
 * @param {Object} date - date object
 * @returns {string} - return a string of the date
 * module:Utility~dateToString
 */
exports.dateToString = date => {
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
exports.createDirectory = path => {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
}