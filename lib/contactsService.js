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
 * @property {String} phone - Contact phone number.
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
     * @returns {module:lib/contactsService.contact[]} Contact information for all contacts in the address book.
     */
    static async getContacts({ addressBookId }) {
        const contacts = await knex(CONTACTS_TABLE).select('name', 'phone_number as phoneNumber').where({ address_book_id: addressBookId });

        return contacts;
    }
}

module.exports = {
    ContactsService
};
