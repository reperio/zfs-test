const fs = require('fs');
const cp = require('child_process');
const spawn = cp.spawn;

//process = child_process.spawn('sh', ['-c', 'unoconv -f pdf --stdout sample.doc | pdftotext -layout -enc UTF-8 - out.txt']);

class ZFSApi {
	constructor() {
		
	}

	create_snapshot(snapshot_name) {
		console.log('spawning zfs snapshot');

		var child = spawn('sh', ['-c', `zfs snapshot ${snapshot_name}`]);

		child.addListener('exit', function(code){
			console.log(`Snapshot create complete: ${code}`);

			return code || 0;
		});
	}

	send_file(snapshot_name, file_name) {
		console.log('spawning zfs send to file');

		var child = spawn('sh', ['-c', `zfs send ${snapshot_name} > ${file_name}`]);
		
		child.addListener('exit', function (code) {
			console.log(`Send complete: ${code}`);
			
			return code || 0;
		});
	}

	send_mbuffer(snapshot_name, host, port) {
		console.log('spawning zfs send to mbuffer');

		var child = spawn('sh', ['-c', `zfs send ${snapshot_name} | mbuffer -O ${host}:${port}`]);

		child.addListener('exit', function (code) {
			console.log(`Send complete: ${code}`);

			return code || 0;
		});
	}

	receive_mbuffer_to_file(file_name, port) {
		console.log('spwaning mbuffer to receive to file');

		var child = spawn('sh', ['-c', `mbuffer -I ${port} -o ${file_name}`]);

		child.addListener('exit', function(code){
			console.log(`Receive complete: ${code}`);
			
			return code || 0;
		});
	}

	receive_mbuffer_to_zfs_receive(receive_target, port) {
		console.log('spawning mbuffer to receive to zfs receive');

		var child = spawn('sh', ['-c', `mbuffer -I ${port} | zfs receive ${receive_target}`]);

		child.addListener('exit', function(code){
			console.log(`Receive complete: ${code}`);

			return code || 0;
		});
	}
}

module.exports = ZFSApi;


