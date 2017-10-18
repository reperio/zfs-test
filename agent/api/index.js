'use strict';

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

    server.route(require('./handlers/zfs_agent'));

    server.app.zfs_controller_api = require('../controller_api')(server.app.config);
    
    next();
};

exports.register.attributes = {
    name: 'apiPlugin',
    version: '1.0.0'
};