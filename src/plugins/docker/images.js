/** Docker images wrapper that execute operations on host images
 * @module DockerWrapper/Images
 */
import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

/**
 * Execute the command to pull an image
 * @param {string} container - the name of the image to pull (example: `myrepo/myimage:tag`)
 * @returns {Promise.<T>} - return a promise
 * module:DockerWrapper/Images~pullContainer
 */
function pullContainer (container) {
  return docker.pull(container)
}

export {
  pullContainer
}
