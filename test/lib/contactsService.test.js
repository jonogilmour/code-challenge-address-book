'use strict';

const test = require('ava');
const sinon = require('sinon');
const { knex } = require('../../lib/db');
const mockDb = require('../mockDb');
const { ContactsService } = require('../../lib/contactsService');

const sandbox = sinon.createSandbox();

test.before(async t => {
    await mockDb.create();
});

test.afterEach.always(async t => {
    await mockDb.prune();
});

test.after.always(async t => {
    await mockDb.destroy();
});

test.serial(`getContacts | should return all contacts in an address book`, async t => {
    await knex.batchInsert('contacts', [
        {
            name: 'Gerald Myers',
            phone_number: '0441',
            address_book_id: '123'
        },
        {
            name: 'Harold Myers',
            phone_number: '0441',
            address_book_id: '123'
        },
        {
            name: 'Jane Steffen',
            phone_number: '0445',
            address_book_id: '123'
        },
        {
            name: 'Yukiko Yamada',
            phone_number: '0442',
            address_book_id: '125'
        }
    ]);

    t.deepEqual((await ContactsService.getContacts({ addressBookId: '123' })).map(x => ({ ...x })), [
        {
            name: 'Gerald Myers',
            phoneNumber: '0441'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445'
        }
    ]);
    t.deepEqual((await ContactsService.getContacts({ addressBookId: '125' })).map(x => ({ ...x })), [
        {
            name: 'Yukiko Yamada',
            phoneNumber: '0442'
        }
    ]);
});
