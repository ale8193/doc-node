const express = require('express')
const containersController = require('controllers/containersController')
const router = new express.Router()

/**
 * @route   GET api/<version>/containers/
 * @desc    Return a list of active containers
 * @access  Private
 */
router.get('/', containersController.containersGET)

/**
 * @route   GET api/<version>/containers/{id}
 * @desc    Return a container object
 * @access  Private
 */
router.get('/:id', containersController.containerByIdGET)

/**
 * @route   GET api/<version>/containers/{id}/mounts
 * @desc    Returns an array of mounts object
 * @access  Private
 */
router.get('/:id/mounts', containersController.containerMountsGET)

/**
 * @route   POST api/<version>/containers/{id}/backup
 * @desc    Create volumes backup of the container passed by Id.
 * @access  Private
 */
router.post('/:id/backup', containersController.containerBackupPOST)

module.exports = router
