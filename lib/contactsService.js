'use strict';

const { knex } = require('./db');

/**
 * @module
 */

const CONTACTS_TABLE = 'contacts';

/**
 * Enumeration of errors which can be thrown by this service.
 * @memberof module:lib/contactsService
 * @readonly
 * @enum {Symbol}
 */
const errors = {
    CONTACT_EXISTS: Symbol('CONTACT_EXISTS')
};

/**
 * Contact object.
 *
 * @typedef Contact
 * @memberof module:lib/contactsService
 * @property {String} name - Contact name.
 * @property {String} phoneNumber - Contact phone number.
 * @property {String} addressBookId - ID of the address book that this contact is from.
 */

/**
 * @classdesc Handles operations relating to contacts.
 * @hideconstructor
 */
class ContactsService {
    /**
     * Enumeration of errors which can be thrown by this service.
     * @type {module:lib/contactsService.errors}
     */
    static get errors() {
        return errors;
    }

    /**
     * Gets all contacts in an address book, sorted by name.
     *
     * @param {Object} obj - The arguments object.
     * @param {String} obj.addressBookId - The address book ID.
     * @returns {module:lib/contactsService.Contact[]} Contact information for all contacts in the address book.
     */
    static async getContacts({ addressBookId }) {
        const contacts = await knex(CONTACTS_TABLE).select(
            'name',
            'phone_number as phoneNumber',
            'address_book_id as addressBookId'
        ).where({ address_book_id: addressBookId }).orderBy('name');

        return contacts;
    }

    /**
     * Gets all contacts in multiple address books, sorted by name.
     *
     * @param {Object} obj - The arguments object.
     * @param {String[]} obj.addressBookIds - The address book IDs.
     * @returns {module:lib/contactsService.Contact[]} Contact information for all contacts in all specified address books.
     */
    static async getContactsMultiple({ addressBookIds }) {
        if (!addressBookIds.length) return [];

        const contacts = await knex(CONTACTS_TABLE).select(
            'name',
            'phone_number as phoneNumber',
            'address_book_id as addressBookId'
        ).whereIn('address_book_id', addressBookIds).orderBy(['name', 'address_book_id']);

        return contacts;
    }

    /**
     * Creates a new contact.
     *
     * @param {Object} obj - The arguments object.
     * @param {String} obj.name - The name of the contact.
     * @param {String} obj.phoneNumber - The phone number of the contact.
     * @param {String} obj.addressBookId - The ID of the address book to add the contact to.
     * @returns {module:lib/contactsService.Contact} The new contact.
     */
    static async addContact({ name, phoneNumber, addressBookId }) {
        const [contactExists] = await knex(CONTACTS_TABLE).select('*').where({ name, phone_number: phoneNumber, address_book_id: addressBookId });

        if (contactExists) {
            throw new SymbolError(errors.CONTACT_EXISTS);
        }

        await knex(CONTACTS_TABLE).insert({ name, phone_number: phoneNumber, address_book_id: addressBookId });

        return { name, phoneNumber, addressBookId };
    }
}

module.exports = {
    ContactsService
};
