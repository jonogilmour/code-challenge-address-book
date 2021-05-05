'use strict';

const test = require('ava');
const sinon = require('sinon');
const Joi = require('joi');
const server = require('../../../server');
const contactsSchema = require('../../../api/contacts/contactsSchema');
const { ContactsService } = require('../../../lib/contactsService');

const sandbox = sinon.createSandbox();

test.beforeEach(async () => {
    sandbox.stub(ContactsService, 'getContacts').rejects();
    sandbox.stub(ContactsService, 'getContactsMultiple').rejects();
});

test.afterEach.always(async t => {
    sandbox.restore();
});

test.serial(`GET /v1/address_book/{addressBookId}/contacts | should return all contacts in the address book`, async t => {
    ContactsService.getContacts.withArgs({ addressBookId: '10' }).resolves([
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '10'
        }
    ]);
    const request = {
        method: 'GET',
        url: '/address_book/10/contacts'
    };

    const response = await server.inject(request);
    const payload = JSON.parse(response.payload);

    t.is(response.statusCode, 200);

    t.deepEqual(payload, [
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '10'
        }
    ]);

    // Ensure the response data is valid
    t.falsy(contactsSchema.contactsList.validate(payload).error);
});

test.serial(`GET /v1/address_book/{addressBookId}/contacts | should return a 404 if the address book is not found`, async t => {
    ContactsService.getContacts.withArgs({ addressBookId: '10' }).resolves([]);
    const request = {
        method: 'GET',
        url: '/address_book/10/contacts'
    };

    const response = await server.inject(request);

    t.is(response.statusCode, 404);
    t.is(response.result.message, 'Contacts not found');
});

test.serial(`GET /v1/address_book/{addressBookId}/contacts | should return a 400 error if the address book ID is not well formed`, async t => {
    const request = {
        method: 'GET',
        url: '/address_book/x-9/contacts'
    };

    const response = await server.inject(request);

    t.is(response.statusCode, 400);
});

test.serial(`GET /v1/address_book/{addressBookId}/contacts | should return all unique contacts between the address book and the compareTo address book`, async t => {
    ContactsService.getContactsMultiple.withArgs({ addressBookIds: ['10', '11'] }).resolves([
        {
            name: 'Baggins Myers',
            phoneNumber: '0441',
            addressBookId: '11'
        },
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '11'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '10'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '11'
        },
        {
            name: 'Reginald Fredinald',
            phoneNumber: '0446',
            addressBookId: '10'
        },
        {
            name: 'Reginald Fredinald',
            phoneNumber: '0446',
            addressBookId: '11'
        }
    ]);
    const request = {
        method: 'GET',
        url: '/address_book/10/contacts?compareTo=11'
    };

    const response = await server.inject(request);
    const payload = JSON.parse(response.payload);

    t.is(response.statusCode, 200);

    t.deepEqual(payload, [
        {
            name: 'Baggins Myers',
            phoneNumber: '0441',
            addressBookId: '11'
        },
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        }
    ]);

    // Ensure the response data is valid
    t.falsy(contactsSchema.contactsList.validate(payload).error);
});

test.serial(`GET /v1/address_book/{addressBookId}/contacts | should return all unique contacts between the address book and MULTIPLE compareTo address books`, async t => {
    ContactsService.getContactsMultiple.withArgs({ addressBookIds: ['10', '11', '12'] }).resolves([
        {
            name: 'Baggins Myers',
            phoneNumber: '0441',
            addressBookId: '11'
        },
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '11'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '12'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '10'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '11'
        },
        {
            name: 'Reginald Fredinald',
            phoneNumber: '0446',
            addressBookId: '10'
        },
        {
            name: 'Reginald Fredinald',
            phoneNumber: '0446',
            addressBookId: '11'
        },
        {
            name: 'Zetta Firenze',
            phoneNumber: '0492',
            addressBookId: '12'
        }
    ]);
    const request = {
        method: 'GET',
        url: '/address_book/10/contacts?compareTo=11,12'
    };

    const response = await server.inject(request);
    const payload = JSON.parse(response.payload);

    t.is(response.statusCode, 200);

    t.deepEqual(payload, [
        {
            name: 'Baggins Myers',
            phoneNumber: '0441',
            addressBookId: '11'
        },
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10'
        },
        {
            name: 'Zetta Firenze',
            phoneNumber: '0492',
            addressBookId: '12'
        }
    ]);

    // Ensure the response data is valid
    t.falsy(contactsSchema.contactsList.validate(payload).error);
});

test.serial(`GET /v1/address_book/{addressBookId}/contacts | should return a 400 error if any of the compareTo IDs are not well formed`, async t => {
    const request = {
        method: 'GET',
        url: '/address_book/10/contacts?compareTo=a-1,12'
    };

    const response = await server.inject(request);

    t.is(response.statusCode, 400);
});

test.serial(`GET /v1/address_book/{addressBookId}/contacts | should return a 400 error if no compareTo IDs are provided`, async t => {
    const request = {
        method: 'GET',
        url: '/address_book/10/contacts?compareTo='
    };

    const response = await server.inject(request);

    t.is(response.statusCode, 400);
});
