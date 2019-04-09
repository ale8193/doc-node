/** Volumes controller module, containing methods for volumes API
 * @module Controllers/volumesController
 */

const baseController = require('controllers/baseController')
const dockerVolumes = require('plugins/docker/volumes')

/**
 * Allow to retrive all volume objects that are in the host machine (for additional information [Docker API Reference - volume list](https://docs.docker.com/engine/api/v1.39/#operation/VolumeList))
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {function} next - the next middleware function
 * module:Controllers/volumesController~volumesListGET
 */
const volumesListGET = (req, res, next) => dockerVolumes.listVolumes()
  .then(volumes => baseController.successResponse(volumes)).catch(next)

module.exports = {
  volumesListGET
}
