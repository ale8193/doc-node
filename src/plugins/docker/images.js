/** Docker images wrapper that execute operations on host images
 * @module DockerWrapper/Images
 */
const Docker = require('dockerode')

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

/**
 * Execute the command to pull an image
 * @param {string} container - the name of the image to pull (example: `myrepo/myimage:tag`)
 * @returns {Promise.<T>} - return a promise
 * module:DockerWrapper/Images~pullContainer
 */
const pullContainer = (container) => {
  return docker.pull(container)
}

module.exports = {
  pullContainer
}
