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

test.serial(`GET /v1/contacts/{addressBookId} | should return all contacts in the address book`, async t => {
    ContactsService.getContacts.withArgs({ addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4' }).resolves([
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        }
    ]);
    const request = {
        method: 'GET',
        url: '/contacts/10175b3b-03d9-47b7-80b2-8a74b050c1b4'
    };

    const response = await server.inject(request);
    const payload = JSON.parse(response.payload);

    t.is(response.statusCode, 200);

    t.deepEqual(payload, [
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        }
    ]);

    // Ensure the response data is valid
    t.falsy(contactsSchema.contactsList.validate(payload).error);
});

test.serial(`GET /v1/contacts/{addressBookId} | should return a 404 if the address book is not found`, async t => {
    ContactsService.getContacts.withArgs({ addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4' }).resolves([]);
    const request = {
        method: 'GET',
        url: '/contacts/10175b3b-03d9-47b7-80b2-8a74b050c1b4'
    };

    const response = await server.inject(request);

    t.is(response.statusCode, 404);
    t.is(response.result.message, 'Contacts not found');
});

test.serial(`GET /v1/contacts/{addressBookId} | should return a 400 error if the address book ID is not well formed`, async t => {
    const request = {
        method: 'GET',
        url: '/contacts/10175b3b-0d9-47b7-80b2-8a74b050c1b4'
    };

    const response = await server.inject(request);

    t.is(response.statusCode, 400);
});

test.serial(`GET /v1/contacts/{addressBookId} | should return all unique contacts between the address book and the compareTo address book`, async t => {
    ContactsService.getContactsMultiple.withArgs({ addressBookIds: ['10175b3b-03d9-47b7-80b2-8a74b050c1b4', '20345b3b-03d9-47b7-80b2-8a74b050c1b4'] }).resolves([
        {
            name: 'Baggins Myers',
            phoneNumber: '0441',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Reginald Fredinald',
            phoneNumber: '0446',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Reginald Fredinald',
            phoneNumber: '0446',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        }
    ]);
    const request = {
        method: 'GET',
        url: '/contacts/10175b3b-03d9-47b7-80b2-8a74b050c1b4?compareTo=20345b3b-03d9-47b7-80b2-8a74b050c1b4'
    };

    const response = await server.inject(request);
    const payload = JSON.parse(response.payload);

    t.is(response.statusCode, 200);

    t.deepEqual(payload, [
        {
            name: 'Baggins Myers',
            phoneNumber: '0441',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        }
    ]);

    // Ensure the response data is valid
    t.falsy(contactsSchema.contactsList.validate(payload).error);
});

test.serial(`GET /v1/contacts/{addressBookId} | should return all unique contacts between the address book and MULTIPLE compareTo address books`, async t => {
    ContactsService.getContactsMultiple.withArgs({ addressBookIds: ['10175b3b-03d9-47b7-80b2-8a74b050c1b4', '20345b3b-03d9-47b7-80b2-8a74b050c1b4', '30345b3b-03d9-47b7-80b2-8a74b050c1b4'] }).resolves([
        {
            name: 'Baggins Myers',
            phoneNumber: '0441',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Harold Myers',
            phoneNumber: '0441',
            addressBookId: '30345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Jane Steffen',
            phoneNumber: '0445',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Reginald Fredinald',
            phoneNumber: '0446',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Reginald Fredinald',
            phoneNumber: '0446',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Zetta Firenze',
            phoneNumber: '0492',
            addressBookId: '30345b3b-03d9-47b7-80b2-8a74b050c1b4'
        }
    ]);
    const request = {
        method: 'GET',
        url: '/contacts/10175b3b-03d9-47b7-80b2-8a74b050c1b4?compareTo=20345b3b-03d9-47b7-80b2-8a74b050c1b4,30345b3b-03d9-47b7-80b2-8a74b050c1b4'
    };

    const response = await server.inject(request);
    const payload = JSON.parse(response.payload);

    t.is(response.statusCode, 200);

    t.deepEqual(payload, [
        {
            name: 'Baggins Myers',
            phoneNumber: '0441',
            addressBookId: '20345b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Gerald Myers',
            phoneNumber: '0441',
            addressBookId: '10175b3b-03d9-47b7-80b2-8a74b050c1b4'
        },
        {
            name: 'Zetta Firenze',
            phoneNumber: '0492',
            addressBookId: '30345b3b-03d9-47b7-80b2-8a74b050c1b4'
        }
    ]);

    // Ensure the response data is valid
    t.falsy(contactsSchema.contactsList.validate(payload).error);
});

test.serial(`GET /v1/contacts/{addressBookId} | should return a 400 error if any of the compareTo IDs are not well formed`, async t => {
    const request = {
        method: 'GET',
        url: '/contacts/10175b3b-03d9-47b7-80b2-8a74b050c1b4?compareTo=20345b3b-039-47b7-80b2-8a74b050c1b4,30345b3b-03d9-47b7-80b2-8a74b050c1b4'
    };

    const response = await server.inject(request);

    t.is(response.statusCode, 400);
});

test.serial(`GET /v1/contacts/{addressBookId} | should return a 400 error if no compareTo IDs are provided`, async t => {
    const request = {
        method: 'GET',
        url: '/contacts/10175b3b-03d9-47b7-80b2-8a74b050c1b4?compareTo='
    };

    const response = await server.inject(request);

    t.is(response.statusCode, 400);
});
