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

test.serial(`getContacts | should return all contacts in an address book, sorted by name`, async t => {
    await knex.batchInsert('contacts', [
        {
            name: 'Jane Steffen',
            phone_number: '0445',
            address_book_id: '123'
        },
        {
            name: 'Harold Myers',
            phone_number: '0441',
            address_book_id: '123'
        },
        {
            name: 'Yukiko Yamada',
            phone_number: '0442',
            address_book_id: '125'
        },
        {
            name: 'Gerald Myers',
            phone_number: '0441',
            address_book_id: '123'
        }
    ]);

    t.deepEqual((await ContactsService.getContacts({ addressBookId: '123' })).map(x => ({ ...x })), [
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
    t.deepEqual((await ContactsService.getContacts({ addressBookId: '125' })).map(x => ({ ...x })), [
        {
            name: 'Yukiko Yamada',
            phoneNumber: '0442',
            addressBookId: '125'
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

test.serial(`getContactsMultiple | should return all contacts in more than one address book, sorted by name and then address book ID`, async t => {
    await knex.batchInsert('contacts', [
        {
            name: 'Yukiko Yamada',
            phone_number: '0442',
            address_book_id: '125'
        },
        {
            name: 'Harold Myers',
            phone_number: '0441',
            address_book_id: '123'
        },
        {
            name: 'Jane Steffen',
            phone_number: '0445',
            address_book_id: '125'
        },
        {
            name: 'Jane Steffen',
            phone_number: '0445',
            address_book_id: '123'
        },
        {
            name: 'Gerald Myers',
            phone_number: '0441',
            address_book_id: '123'
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
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '125'
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

    t.deepEqual((await ContactsService.getContactsMultiple({ addressBookIds: ['111', '222', '400'] })), []);
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

test.serial(`addContact | should add a single contact to the DB and return it`, async t => {
    const contact = await ContactsService.addContact({ name: 'Jerry Seinfeld', phoneNumber: '1222', addressBookId: '12' });
    const contactDB = await knex('contacts').select('*').where({ name: 'Jerry Seinfeld', phone_number: '1222', address_book_id: '12' });
    t.is(contactDB.length, 1);
    t.deepEqual(contact, { name: 'Jerry Seinfeld', phoneNumber: '1222', addressBookId: '12' });
});

test.serial(`addContact | should throw CONTACT_EXISTS if the contact already exists`, async t => {
    await knex('contacts').insert({ name: 'Jerry Seinfeld', phone_number: '1222', address_book_id: '12' });

    const error = await t.throwsAsync(ContactsService.addContact({ name: 'Jerry Seinfeld', phoneNumber: '1222', addressBookId: '12' }));

    t.is(error.code, ContactsService.errors.CONTACT_EXISTS);
});
