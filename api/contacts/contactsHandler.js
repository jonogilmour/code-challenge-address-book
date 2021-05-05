'use strict';

const Boom = require('boom');
const { ContactsService } = require('../../lib/contactsService');

/**
 * @module
 */

const ADDRESS_BOOK_NOT_FOUND = Symbol('ADDRESS_BOOK_NOT_FOUND');
const COMPARE_NOT_FOUND = Symbol('COMPARE_NOT_FOUND');

/**
 * Creates a set of all contacts in the form `'name:phoneNumber'`.
 * @private
 */
const createContactsSet = contacts => new Set(contacts.map(({ name, phone }) => `${name}:${phone}`));

module.exports = {
    /**
     * Gets all contacts in an address book. Can also select unique contacts between two address books.
     *
     * @param {Request} request - The Hapi request object.
     * @returns {Response} The order total.
     */
    getContacts: async request => {
        const { addressBookId } = request.params;
        const { compareTo } = request.query;

        try {
            const [contacts, compare = []] = await Promise.all([
                ContactsService.getContacts({ addressBookId }),
                compareTo && ContactsService.getContacts({ addressBookId: compareTo })
            ]);

            if (!contacts.length) {
                throw new SymbolError(ADDRESS_BOOK_NOT_FOUND);
            }

            if (compareTo && !compare.length) {
                throw new SymbolError(COMPARE_NOT_FOUND);
            }

            if (compareTo) {
                const contactsSet = createContactsSet(contacts);
                const compareSet = createContactsSet(compare);
                return [
                    ...contacts.filter(contact => !contactsSet.has(`${contact.name}:${contact.phone}`)),
                    ...compare.filter(contact => !compareSet.has(`${contact.name}:${contact.phone}`))
                ]
            }

            return contacts;
        } catch (err) {
            switch (err.code) {
                case ADDRESS_BOOK_NOT_FOUND:
                    throw Boom.notFound('Address book not found');
                case COMPARE_NOT_FOUND:
                    throw Boom.notFound('Comparison address book not found');
                default:
                    throw Boom.badImplementation(err);
            }
        }
    }
};
