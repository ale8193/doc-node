/** Containers controller module, containing methods for controllers API
 * @module Controllers/containersController
 */

import * as baseController from 'controllers/baseController'
import * as dockerContainers from 'plugins/docker/containers'
import * as sender from 'plugins/destination/sender'
import path from 'path'

/**
 * Allow to retrive all containers object that are running in the host machine (for additional information [Docker API Reference - container list](https://docs.docker.com/engine/api/v1.39/#operation/ContainerList))
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {function} next - the next middleware function
 * module:Controllers/containersController~containersGET
 */
const containersGET = (req, res, next) => dockerContainers.listContainers()
  .then(containers => baseController.successResponse(res, { containers })).catch(next)

/**
 * Allow to retrive a container object by passing its ID
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {function} next - the next middleware function
 * module:Controllers/containersController~containerByIdGET
 */
const containerByIdGET = (req, res, next) => {
  // Check if is present the id param otherwise raise an error
  if (req.params.id === undefined) {
    baseController.errorResponse(res, 400, 'Bad request. Container ID is required and must be a string')
  }
  dockerContainers.getContainer(req.params.id)
    .then(container => {
      // Check if the container request exists otherwise raise an error
      if (!container) {
        return baseController.errorResponse(res, 404, 'A container with the specified ID was not found')
      }

      // Return the volumes
      return baseController.successResponse(res, container)
    })
    .catch(err => next(err))
}

const containerMountsGET = (req, res, next) => {
  // Check if is present the id param otherwise raise an error
  if (req.params.id === undefined) {
    baseController.errorResponse(res, 400, 'Bad request. Container ID is required and must be a string')
  }
  dockerContainers.getContainer(req.params.id)
    .then(container => {
      // Check if the container request exists otherwise raise an error
      if (!container) {
        return baseController.errorResponse(res, 404, 'A container with the specified ID was not found')
      }

      // Return the mounts
      return baseController.successResponse(res, { mounts: container.Mounts })
    })
    .catch(err => next(err))
}

/**
 * Create a backup file for each volumes mounted in the container
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {function} next - the next middleware function
 * module:Controllers/containersController~containerBackupPOST
 */
const containerBackupPOST = (req, res, next) => {
  // Check if is present the id param otherwise raise an error
  if (req.params.id === undefined) {
    baseController.errorResponse(res, 400, 'Bad request. Container ID is required and must be a string')
  }
  dockerContainers.getContainer(req.params.id)
    .then(container => {
      // Check if the container request exists otherwise raise an error
      if (!container) {
        return baseController.errorResponse(res, 404, 'A container with the specified ID was not found')
      }

      // Execute the backups
      const backupPromises = executeContainerBackup(container)

      Promise.all(backupPromises)
        .then((backups) => {
          // Send the backups to the save destination
          const sendBackupPromises = sendBackups(backups)

          Promise.all(sendBackupPromises)
            .then(() => baseController.successResponse(res, { backups }))
        })
    })
    .catch(err => next(err))
}

/**
 * Method that use docker plugin to create a backup for each volume of the container passed as argument
 * @param {Object} container - container object
 * @returns {Array.<Promise.<Backup>>} - return an array of promises each one resolved with a {@link Backup} object
 */
const executeContainerBackup = container => {
  // Container object has an array of names and each one start with a /
  let containerName = container.Names[0] // Take the first element
  containerName = containerName.substring(1, containerName.length) // Remove the first char that is a /

  // Create an array of promises of backup
  return container.Mounts.map(volume => {
    let backupName = volume.Destination // Name of volume
    backupName = backupName.replace(/\//g, '-') // Replace / with - because this name will be use as file name of the backup file
    backupName = backupName.substr(1, backupName.length) // Remove the first char that is a /
    return dockerContainers.backupContainer(containerName, backupName, volume.Destination)
  })
}

/**
 * Method that use sender plugin to send the backup created to the configurated save destination
 * @param {Array.<Backup>} backups - array of {@link Backup} object
 * @returns {Array.<Promise.<Backup>>} - return an array of promises
 */
const sendBackups = backups => {
  return backups.map(bkp => sender.sendBackup(
    path.join(__dirname, '..', 'backups'),
    bkp.toString('.tar')
  ))
}

export {
  containersGET,
  containerByIdGET,
  containerMountsGET,
  containerBackupPOST
}
