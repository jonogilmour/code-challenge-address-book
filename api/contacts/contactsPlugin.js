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
            path: '/contacts/{addressBookId}',
            handler: contactsHandler.getContacts,
            config: {
                description: 'Gets the contacts in an address book.',
                notes: 'Get only unique contacts between two address books with the `compareTo` param.',
                tags: ['api'],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            200: {
                                description: 'The list of contacts.',
                                schema: contactsSchema.contactsList
                            },
                            404: {
                                description: 'The address book or comparison address book cannot be found',
                                schema: validation.statusCode[404]
                            }
                        }
                    }
                },
                validate: {
                    params: contactsSchema.params.getContacts
                }
            }
        });
    }
};
