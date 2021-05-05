'use strict';

require('./lib/errors');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const routes = require('./api/routes');
const { initDb } = require('./initDb');

const swaggerOptions = {
    info: {
        version: '1.0.0',
        title: 'API Documentation',
        description: `Fancy docs. Pretty.`
    },
    pathPrefixSize: 2
}

const server = new Hapi.Server({
    host: process.env.NODE_HOST || 'localhost',
    port: process.env.PORT || 4000,
    routes: {
        timeout: {
            server: 1000 * 30 // 30s
        }
    }
});

const start = async () => {
    await server.register([
        Inert,
        Vision,
        {
            plugin: require('hapi-swagger'),
            options: swaggerOptions
        }
    ]);

    await routes.register(server);
    await server.start();
    return server;
};

start()
    .then(async () => {
        process.env.NODE_ENV !== 'test' && console.log('info', `Server running at ${server.info.uri}`);
        process.env.NODE_ENV !== 'test' && initDb();
    })
    .catch(err => {
        console.error('error', err);
        process.exit(1);
    });

module.exports = server;
