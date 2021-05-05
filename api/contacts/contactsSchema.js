'use strict';

const Joi = require('joi');

const addressBookId = Joi.string().guid({ version: 'uuidv4' }).label('Address book ID').example('eff30086-a381-4fd6-ca55-7af017d25825');

const contact = Joi.object({
    name: Joi.string().required().label('Contact name'),
    phoneNumber: Joi.string().required().label('Contact phone number'),
    addressBookId: addressBookId.required()
}).required().label('Contact details');

const contactsList = Joi.array().items(contact).required().label('List of contacts');

const params = {
    getContacts: Joi.object({ addressBookId: addressBookId.required() })
};

const uuidv4s = /^([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12},?)+$/i;

const query = {
    getContacts: Joi.object({
        compareTo: Joi
            .string()
            .pattern(uuidv4s)
            .label('Comparison address book IDs')
            .description('One or more address books to compare against. Separate each ID by a comma to compare multiple address books.')
            .example('eff30086-a381-4fd6-ca55-7af017d25825,fee30086-a381-4fd6-ca95-7af017d2431')
    })
};

module.exports = {
    contact,
    contactsList,
    params,
    query
};
