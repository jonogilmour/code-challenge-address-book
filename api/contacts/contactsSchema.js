'use strict';

const Joi = require('joi');

const addressBookIdPattern = /^[0-9A-Z_]+$/i;
const multiAddressBookIdPattern = /^([0-9A-Z_]+,?)+$/i;

const addressBookId = Joi.string().pattern(addressBookIdPattern).label('Address book ID').description('Only letters, numbers, and underscores are accepted.').example('Aa123');

const contact = Joi.object({
    name: Joi.string().required().label('Contact name'),
    phoneNumber: Joi.string().required().label('Contact phone number'),
    addressBookId: addressBookId.required()
}).required().label('Contact details');

const contactsList = Joi.array().items(contact).required().label('List of contacts');

const params = {
    getContacts: Joi.object({ addressBookId: addressBookId.required() })
};

const query = {
    getContacts: Joi.object({
        compareTo: Joi
            .string()
            .pattern(multiAddressBookIdPattern)
            .label('Comparison address book IDs')
            .description('One or more address books to compare against. Separate each ID by a comma to compare multiple address books.')
            .example('e13,a344')
    })
};

module.exports = {
    contact,
    contactsList,
    params,
    query
};
