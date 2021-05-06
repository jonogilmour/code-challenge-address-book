'use strict';

const contactsHandler = require('./contactsHandler');
const contactsSchema = require('./contactsSchema');
const validation = require('../validation');

module.exports.plugin = {
    name: 'contacts',
    version: '1.0.0',
    register: async server => {
        server.route({
            method: 'GET',
            path: '/address_book/{addressBookId}/contacts',
            handler: contactsHandler.getContacts,
            config: {
                description: 'Gets the contacts in an address book.',
                notes: 'Get only unique contacts between two or more address books with the `compareTo` param.',
                tags: ['api'],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            200: {
                                description: 'The list of contacts.',
                                schema: contactsSchema.contactsList
                            },
                            404: {
                                description: 'The address book cannot be found',
                                schema: validation.statusCode[404]
                            }
                        }
                    }
                },
                validate: {
                    params: contactsSchema.params.getContacts,
                    query: contactsSchema.query.getContacts
                }
            }
        });

        server.route({
            method: 'POST',
            path: '/address_book/{addressBookId}/contacts',
            handler: contactsHandler.addContact,
            config: {
                description: 'Adds a new contact to an address book.',
                notes: 'Adds a new contact to an address book.',
                tags: ['api'],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            201: {
                                description: 'The newly created contact.',
                                schema: contactsSchema.contact
                            },
                            409: {
                                description: 'The contact already exists',
                                schema: validation.statusCode[409]
                            }
                        }
                    }
                },
                validate: {
                    params: contactsSchema.params.addContact,
                    payload: contactsSchema.payload.addContact
                }
            }
        });
    }
};
