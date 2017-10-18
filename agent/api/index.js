'use strict';
const ControllerApi = require('../controller_api');
const ZFSAgentHandlers = require('./handlers/zfs_agent');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply({message:'hello', status:'success'});
        }
    });

    server.route({
        method: 'OPTIONS',
        path: '/{p*}',
        config: {
            handler: function(request, reply) {
                var response = reply();
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                return response;
            },
            cors: true
        }
    });

    const agent_handlers = new ZFSAgentHandlers(server.app.logger);

    server.route(agent_handlers.get_routes());
    server.app.zfs_controller_api = new ControllerApi(server.app.config);
    
    next();
};

exports.register.attributes = {
    name: 'apiPlugin',
    version: '1.0.0'
};