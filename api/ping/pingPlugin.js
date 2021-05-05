'use strict';

module.exports.plugin = {
    name: 'ping',
    version: '1.0.0',
    register: async server => {
        server.route({
            method: 'GET',
            path: '/ping',
            config: {
                handler: () => new Date(),
                description: 'Ping',
                notes: 'Ping.'
            }
        });
    }
};
