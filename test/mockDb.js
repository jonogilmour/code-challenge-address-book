'use strict';

const { knex } = require('../lib/db');
const { tableDefinitions } = require('../initDb');

module.exports = {
    destroy: async () => Promise.all(Object.keys(tableDefinitions).map(t => knex.schema.dropTableIfExists(t))),
    prune: async () => Promise.all(Object.keys(tableDefinitions).map(t => knex(t).whereRaw('1 = 1').del())),
    create: async () => {
        await module.exports.destroy();
        return Promise.all(Object.entries(tableDefinitions)
            .reduce((arr, [tableName, tableDefFunction]) => [
                ...arr,
                knex.schema.createTable(tableName, tableDefFunction)
            ], []));
    }
};
