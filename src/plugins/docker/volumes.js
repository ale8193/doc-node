/** Docker volumes wrapper that execute operations on host volumes
 * @module DockerWrapper/Volumes
 */

import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

/**
 * List of all volumes in the host machine
 * @param {Object} options - options to filter the result of the listing, for additional information [Docker API Reference - volume list](https://docs.docker.com/engine/api/v1.39/#operation/VolumeList)
 * @returns {Promise.<Array.<Object>>} - return a promise resolved with an array of volume object
 * module:DockerWrapper/Volumes~listVolumes
 */
function listVolumes (options = {}) {
  // const docker = new Docker({socketPath: '/var/run/docker.sock'});
  return docker.listVolumes(options)
}

export {
  listVolumes
}
