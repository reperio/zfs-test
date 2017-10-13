const zfs_api = require('./zfs_api');

const api = new zfs_api();


async function execute() {
	try {
		console.log('creating snapshot');

		await api.receive_mbuffer_to_zfs_receive('dev2/dev1', 1234);

		console.log('finished creating snapshot');
	} catch(err) {
		console.log('failed to create snapshot');
		console.log(err);
	}
};

execute();

