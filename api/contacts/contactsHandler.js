'use strict';

const Boom = require('boom');
const { ContactsService } = require('../../lib/contactsService');

/**
 * @module
 */

const CONTACTS_NOT_FOUND = Symbol('CONTACTS_NOT_FOUND');

/**
 * Sifts out duplicates from a contacts array. There can be any number of duplicate contacts present (ie more than 2).
 * @private
 */
const removeCommon = contacts => {
    const removed = new Set();
    const ref = new Map();
    contacts.forEach(contact => {
        const contactRef = `${contact.name}:${contact.phoneNumber}`;
        if (!ref.has(contactRef) && !removed.has(contactRef)) {
            ref.set(contactRef, contact);
        } else {
            ref.delete(contactRef, true);
            removed.add(contactRef);
        }
    });

    return Array.from(ref.values());
};

module.exports = {
    /**
     * Gets all contacts in an address book. Can also select unique contacts between multiple address books.
     *
     * @param {Request} request - The Hapi request object.
     * @returns {Response} The contact details.
     */
    getContacts: async request => {
        const { addressBookId } = request.params;
        const compareTo = request.query.compareTo && request.query.compareTo.split(',');

        try {
            const contacts = compareTo
                ? await ContactsService.getContactsMultiple({ addressBookIds: [addressBookId, ...compareTo] })
                : await ContactsService.getContacts({ addressBookId });

            if (!contacts.length) {
                throw new SymbolError(CONTACTS_NOT_FOUND);
            }

            return compareTo
                ? removeCommon(contacts)
                : contacts;
        } catch (err) {
            switch (err.code) {
                case CONTACTS_NOT_FOUND:
                    throw Boom.notFound('Contacts not found');
                default:
                    throw Boom.badImplementation(err);
            }
        }
    },

    /**
     * Adds a new contact to an address book.
     *
     * @param {Request} request - The Hapi request object.
     * @param {Object} t - The Hapi response toolkit.
     * @returns {Response} The new contact details.
     */
    addContact: async (request, t) => {
        const { addressBookId } = request.params;
        const { name, phoneNumber } = request.payload;

        try {
            const contact = await ContactsService.addContact({ name, phoneNumber, addressBookId });
            return t.response(contact).code(201);
        } catch (err) {
            switch (err.code) {
                case ContactsService.errors.CONTACT_EXISTS:
                    throw Boom.conflict('Contact already exists');
                default:
                    throw Boom.badImplementation(err);
            }
        }
    }
};
