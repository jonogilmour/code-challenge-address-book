'use strict';

const test = require('ava');
const sinon = require('sinon');
const Joi = require('joi');
const server = require('../../../server');
const contactsSchema = require('../../../api/contacts/contactsSchema');
const { ContactsService } = require('../../../lib/contactsService');

const sandbox = sinon.createSandbox();

test.beforeEach(async () => {
    sandbox.stub(ContactsService, 'getContacts').rejects(new SymbolError('NONE'));
    sandbox.stub(ContactsService, 'getContactsMultiple').rejects(new SymbolError('NONE'));
});

test.afterEach.always(async t => {
    sandbox.restore();
});

test.serial(`GET /v1/contacts/{addressBookId} | should return all contacts in the address book sorted by their name`, async t => {
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
