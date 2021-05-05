'use strict';

const knex = require('knex');

/**
 * @module
 * @description Database connector setup.
 *
 * See: https://www.npmjs.com/package/knex
 */

const connection = {
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'jonogilmour_test',
    timezone: 'UTC',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306
}

/**
 * The database connector instance.
 *
 * @returns {Knex} The Knex instance.
 */
const connector = knex({
    client: 'mysql',
    connection,
    pool: {
        min: 1,
        max: 5,
        afterCreate: (conn, done) => {
            process.env.NODE_ENV !== 'test' && console.log(`connected to ${connection.database} @ ${connection.host}:${connection.port}`);
            done(null, conn);
        }
    }
});

/**
 */
const connect = async () => {
    try {
        await connector.raw('SELECT 1');
    } catch (err) {
        console.log(`error connecting to DB: ${err.sqlMessage}`);

        if (err.fatal) {
            throw err;
        }
    }
};

module.exports = {
    knex: connector,
    connect
};
