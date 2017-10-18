'use strict';

const Boom = require('boom');
const Joi = require('joi');

const zfs_api = require('../../zfs_api');

const routes = [];

routes.push({
    method: ['POST'],
    path: '/zfs/create_snapshot',
    handler: create_snapshot,
    config: {
        cors: true,
        validate: {
            payload: {
                snapshot_name: Joi.string().required()
            }
        }
    }
});
async function create_snapshot(request, reply) {
    try {
        const snapshot_name = request.payload.snapshot_name;

        const api = new zfs_api();

        await api.create_snapshot(snapshot_name);

        return reply({message:'success'});
    }
    catch (e) {
        

        return reply(Boom.badImplementation('Snapshot create failed.'));
    }
}

routes.push({
    method: ['POST'],
    path: '/zfs/send_snapshot',
    handler: send_snapshot,
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
async function send_snapshot(request, reply) {
    try {
        const snapshot_name = request.payload.snapshot_name;
        const host = request.payload.host;
        const port = request.payload.port;

        const api = new zfs_api();

        await api.send_mbuffer_to_host(snapshot_name, host, port);

        return reply({message:'success'});
    }
    catch (e) {
        

        return reply(Boom.badImplementation('Snapshot send failed.'));
    }
}

routes.push({
    method: ['POST'],
    path: '/zfs/receive_snapshot',
    handler: receive_snapshot,
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
async function receive_snapshot(request, reply) {
    try {
        const target = request.payload.target;
        const port = request.payload.port;

        const api = new zfs_api();

        await api.receive_mbuffer_to_zfs_receive(target, port);

        return reply({message:'success'});
    }
    catch (e) {
        

        return reply(Boom.badImplementation('Snapshot receive failed.'));
    }
}

module.exports = routes;