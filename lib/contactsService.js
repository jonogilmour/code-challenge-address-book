'use strict';

const { knex } = require('./db');

/**
 * @module
 */

const CONTACTS_TABLE = 'contacts';

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
     * Gets all contacts in an address book.
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
        ).where({ address_book_id: addressBookId });

        return contacts;
    }

    /**
     * Gets all contacts in multiple address books.
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
        ).whereIn('address_book_id', addressBookIds);

        return contacts;
    }
}

module.exports = {
    ContactsService
};
