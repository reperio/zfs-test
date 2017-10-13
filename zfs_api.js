const fs = require('fs');
const cp = require('child_process');
const streams = require('memory-streams');
const spawn = cp.spawn;

//process = child_process.spawn('sh', ['-c', 'unoconv -f pdf --stdout sample.doc | pdftotext -layout -enc UTF-8 - out.txt']);

class ZFSApi {
	constructor() {
		
	}

	create_snapshot(snapshot_name) {
		const promise = new Promise((resolve, reject) => {
			console.log('spawning zfs snapshot');

			var child = spawn('sh', ['-c', `zfs snapshot ${snapshot_name}`]);

			child.addListener('exit', function(code){
				console.log(`Snapshot create complete: ${code}`);

				if (code === 0) {
					resolve(code);
				} else {
					reject(code);
				}
			});
		});
		
		return promise;
	}

	send_file(snapshot_name, file_name) {
		// const promise = new Promise((resolve, reject) => {
		// 	console.log('spawning zfs send to file');

		// 	var child = spawn('sh', ['-c', `zfs send ${snapshot_name} > ${file_name}`]);
			
		// 	child.addListener('exit', function (code) {
		// 		console.log(`Send complete: ${code}`);
				
		// 		if (code === 0) {
		// 			resolve(code);
		// 		} else {
		// 			reject(code);
		// 		}
		// 	});
		// });

		const promise = new Promise((resolve, reject) => {
			fs.open(file_name, 'w', 400, function (error, fd) {
				if (error)
					return (callback(error));
				
				console.log('spawning zfs send to file');

				const reader = new streams.ReadableStream();
				reader.pipe(fd);
				//const writer = new streams.WritableStream();

				const child = spawn('zfs', ['send', snapshot_name], {stdio: [-1, reader]});
				
				child.addListener('exit', function (code) {
					console.log(`Send complete: ${code}`);
					
					if (code === 0) {
						resolve(code);
					} else {
						reject(code);
					}
				});
			});
		});
		
		return promise;
	}

	//TODO capture stdout of zfs send as one command and pipe it into stdin of another shell command for mbuffer, so we can avoid spawning 'sh'.
	send_mbuffer_to_host(snapshot_name, host, port) {
		const promise = new Promise((resolve, reject) => {
			console.log('spawning zfs send to mbuffer');

			var child = spawn('sh', ['-c', `zfs send ${snapshot_name} | mbuffer -O ${host}:${port}`]);

			child.addListener('exit', function (code) {
				console.log(`Send complete: ${code}`);

				if (code === 0) {
					resolve(code);
				} else {
					reject(code);
				}
			});
		});
		
		return promise;
	}

	receive_mbuffer_to_file(file_name, port) {
		const promise = new Promise((resolve, reject) => {
			console.log('spwaning mbuffer to receive to file');

			var child = spawn('sh', ['-c', `mbuffer -I ${port} -o ${file_name}`]);

			child.addListener('exit', function(code){
				console.log(`Receive complete: ${code}`);
				
				if (code === 0) {
					resolve(code);
				} else {
					reject(code);
				}
			});
		});
		
		return promise;
	}

	receive_mbuffer_to_zfs_receive(receive_target, port) {
		const promise = new Promise((resolve, reject) => {
			console.log('spawning mbuffer to receive to zfs receive');

			var child = spawn('sh', ['-c', `mbuffer -I ${port} | zfs receive ${receive_target}`]);

			child.addListener('exit', function(code){
				console.log(`Receive complete: ${code}`);

				if (code === 0) {
					resolve(code);
				} else {
					reject(code);
				}
			});
		});
		
		return promise;
	}
}

module.exports = ZFSApi;


