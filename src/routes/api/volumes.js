const express = require('express')
const volumesController = require('controllers/volumesController')
const router = new express.Router()

/**
 * @route   GET api/<version>/volumes/list
 * @desc    Returns a list of all volumes
 * @access  Private
 */
router.get('/list', volumesController.volumesListGET)

module.exports = router
