const zfs_api = require('./zfs_api');

const api = new zfs_api();


async function execute() {
	try {
		console.log('sending snapshot');

		await api.send_mbuffer_to_host('dev1@dev1snap1', 'localhost', 1234);

		console.log('finished sending snapshot');
	} catch(err) {
		console.log('failed to send snapshot');
		console.log(err);
	}
};

execute();
