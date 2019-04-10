/** Docker containers wrapper that execute operations on host containers
 * @module DockerWrapper/Containers
 */
const Docker = require('dockerode')
const path = require('path')
const BackupObject = require('model/Backup')
const { createDirectory } = require('utility/utility')

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

/**
 * List of all containers in the host machine, by default return only active containers
 * @param {Object} options - options to filter the result of the listing, for additional information [Docker API Reference - container list](https://docs.docker.com/engine/api/v1.39/#operation/ContainerList)
 * @returns {Promise.<Array.<Object>>} - return a promise resolved with an array of container object
 * module:DockerWrapper/Containers~listContainers
 */
const listContainers = (options = {}) => {
  // const docker = new Docker({socketPath: '/var/run/docker.sock'});
  return docker.listContainers(options)
}

/**
 * Method to get a single container by its ID, It is equivalent to `listContainers({filters: {id: [<ID>]}})`
 * @param {string} id - the container ID
 * @returns {Promise.<Object>} - return a promise resolved with a container object
 * module:DockerWrapper/Containers~getContainer
 */
const getContainer = (id) => {
  return listContainers({
    filters: {
      id: [id]
    }
  }).then(containers => containers[0])
}

/**
 * Run the command to create a backup (a tar file) of the volume of one container.
 * @param {string} containerName - the container name
 * @param {string} backupFile - the name of the output backup file
 * @param {string} volume - the path of the volume in the container
 * @param {string} storePath - the path where the backup file will be saved in
 * @returns {Promise.<Backup>} - return a promise resolved with a {@link Backup} object
 * module:DockerWrapper/Containers~backupContainer
 */
const backupContainer = (containerName, backupFile, volume, storePath = path.join(__dirname, '..', 'backups/')) => {
  const backupObject = new BackupObject({
    containerName: containerName,
    backupName: backupFile
  })

  // create storePath folder if not exist
  createDirectory(storePath)

  // docker run --rm --volumes-from <container_name> -v $(pwd):/backup ubuntu tar cvf /backup/<name_backup>.tar <container_volume_name>
  const cmd = ['tar', 'cvf', '/backup/' + backupObject.toString('.tar'), volume]

  return docker.run('ubuntu', cmd, null, {
    Volumes: { '/backup': {} },
    VolumesFrom: [containerName],
    Binds: [storePath + ':/backup:rw']
  })
    .then(container => {
      container.remove()
      return backupObject
    })
}

module.exports = {
  listContainers,
  getContainer,
  backupContainer
}
