'use strict';

const { knex } = require('./lib/db');

const tableDefinitions = {
    contacts: tbl => {
        tbl.increments().primary();
        tbl.string('address_book_id', 36).notNullable();
        tbl.index('address_book_id');
        tbl.string('name', 255);
        tbl.string('phone_number', 16);
    }
};

const initDb = async () => {
    await Promise.all(Object.keys(tableDefinitions).map(t => knex.schema.dropTableIfExists(t)));
    await Promise.all(Object.entries(tableDefinitions)
        .reduce((arr, [tableName, tableDefFunction]) => [
            ...arr,
            knex.schema.createTable(tableName, tableDefFunction)
        ], []));
};

module.exports = { tableDefinitions, initDb };
