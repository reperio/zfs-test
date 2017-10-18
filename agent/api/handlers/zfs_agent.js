'use strict';

const Boom = require('boom');
const Joi = require('joi');

const zfs_api = require('../../zfs_api');


class ZFSAgentHandlers {
    constructor(logger) {
        this.logger = logger;
    }

    get_routes() {
        const routes = [];

        routes.push({
            method: ['POST'],
            path: '/zfs/create_snapshot',
            handler: this.create_snapshot,
            config: {
                cors: true,
                validate: {
                    payload: {
                        snapshot_name: Joi.string().required()
                    }
                }
            }
        });

        routes.push({
            method: ['POST'],
            path: '/zfs/send_snapshot',
            handler: this.send_snapshot,
            config: {
                cors: true,
                validate: {
                    payload: {
                        snapshot_name: Joi.string().required(),
                        host: Joi.string().required(),
                        port: Joi.number().required()
                    }
                }
            }
        });

        routes.push({
            method: ['POST'],
            path: '/zfs/receive_snapshot',
            handler: this.receive_snapshot,
            config: {
                cors: true,
                validate: {
                    payload: {
                        target: Joi.string().required(),
                        port: Joi.number().required()
                    }
                }
            }
        });

        return routes;
    }

    async notify_server() {
        this.logger.info('')
    }
    
    async create_snapshot(request, reply) {
        try {
            const snapshot_name = request.payload.snapshot_name;

            this.logger.info(`Creating snapshot: ${snapshot_name}`);

            const api = new zfs_api();

            const status_code = await api.create_snapshot(snapshot_name);

            this.logger.info(`Create snapshot finished with code: ${code}`);
            

            return reply({message:'success', status_code: code});
        }
        catch (e) {
            this.logger.error(e);

            return reply(Boom.badImplementation('Snapshot create failed.'));
        }
    }
    
    async send_snapshot(request, reply) {
        try {
            const snapshot_name = request.payload.snapshot_name;
            const host = request.payload.host;
            const port = request.payload.port;

            this.logger.info(`Sending snapshot: ${snapshot_name} to ${host}:${port}`);

            const api = new zfs_api();

            api.send_mbuffer_to_host(snapshot_name, host, port).then(notify_server).then(function(code) {
                this.logger.info(`Create snapshot finished with code: ${code}`);
            }).catch(function(code) {
                this.logger.error(`Create snapshot finished with code: ${code}`);
            });

            this.logger.error(`Send command executed.`);

            return reply({message:'success', status_code: 0});
        }
        catch (e) {
            this.logger.error(e);

            return reply(Boom.badImplementation('Snapshot send failed.'));
        }
    }
    
    async receive_snapshot(request, reply) {
        try {
            const target = request.payload.target;
            const port = request.payload.port;

            this.logger.info(`Receiving snapshot: ${target} on port ${port}`);

            const api = new zfs_api();

            api.receive_mbuffer_to_zfs_receive(target, port).then(notify_server).then(function(code) {
                this.logger.info(`Create snapshot finished with code: ${code}`);
            }).catch(function(code) {
                this.logger.error(`Create snapshot finished with code: ${code}`);
            });

            return reply({message:'success', status_code: 0});
        }
        catch (e) {
            this.logger.error(e);

            return reply(Boom.badImplementation('Snapshot receive failed.'));
        }
    }
}

module.exports = ZFSAgentHandlers;