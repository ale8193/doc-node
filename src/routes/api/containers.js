const express = require('express')
const containersController = require('controllers/containersController')
const router = new express.Router()

/**
 * @route   GET api/<version>/containers/list
 * @desc    Return a list of active containers
 * @access  Private
 */
router.get('/list', containersController.containerListGET)

/**
 * @route   POST api/<version>/containers/{id}/backup
 * @desc    Create volumes backup of the container passed by Id.
 * @access  Private
 */
router.post('/:id/backup', containersController.containerBackupPOST)

module.exports = router
