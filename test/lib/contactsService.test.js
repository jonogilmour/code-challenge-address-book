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

test.serial(`getContacts | should return an empty array if no contacts were found for an address book`, async t => {
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

    t.deepEqual((await ContactsService.getContacts({ addressBookId: '600' })).map(x => ({ ...x })), []);
});

test.serial(`getContactsMultiple | should return all contacts in more than one address book`, async t => {
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

    t.deepEqual((await ContactsService.getContactsMultiple({ addressBookIds: ['123', '125'] })).map(x => ({ ...x })), [
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '123'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '123'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '123'
        },
        {
            name: 'Yukiko Yamada',
            phoneNumber: '0442',
            addressBookId: '125'
        }
    ]);
});

test.serial(`getContactsMultiple | should ignore any non-existent address books`, async t => {
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

    t.deepEqual((await ContactsService.getContactsMultiple({ addressBookIds: ['123', '125', '400'] })).map(x => ({ ...x })), [
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '123'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '123'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '123'
        },
        {
            name: 'Yukiko Yamada',
            phoneNumber: '0442',
            addressBookId: '125'
        }
    ]);
});

test.serial(`getContactsMultiple | should return contacts from one address book`, async t => {
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

    t.deepEqual((await ContactsService.getContactsMultiple({ addressBookIds: ['123'] })).map(x => ({ ...x })), [
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '123'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '123'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '123'
        }
    ]);
});

test.serial(`getContactsMultiple | should return an empty array if all address books were not found`, async t => {
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

    t.deepEqual((await ContactsService.getContactsMultiple({ addressBookIds: ['111', '222', '400'] })).map(x => ({ ...x })), []);
});

test.serial(`getContactsMultiple | should return an empty array if no address books were specified`, async t => {
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

    t.deepEqual((await ContactsService.getContactsMultiple({ addressBookIds: [] })).map(x => ({ ...x })), []);
});
