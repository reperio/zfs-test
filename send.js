const zfs_api = require('./zfs_api');

const api = new zfs_api();

console.log('creating snapshot');
api.create_snapshot('dev1@dev1snap1');
console.log('finished creating snapshot');
