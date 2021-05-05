'use strict';

const glob = require('glob');
const path = require('path');

/**
 * @module
 */
module.exports = {

    /**
     * Add all routes from all API plugin files, eg. pingPlugin.js.
     *
     * @param {Server} server - The HAPI server instance.
     */
    register: async server => {
        const plugins = [];
        glob.sync('./api/**/*Plugin.js').forEach(file => {
            plugins.push({
                plugin: require(path.resolve(file))
            });
        });

        await server.register(plugins);
    }
};
