import Backup from '../../src/model/Backup'

describe('Testing Backup object', () => {
  it('should be sane', () => {
    const backup = new Backup('container_name', 'backup_name')
    expect(backup.containerName).toBe('container_name')
    expect(backup.backupName).toBe('backup_name')
  })
})
