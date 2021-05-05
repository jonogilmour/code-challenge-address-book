'use strict';

const Joi = require('joi');

const addressBookId = Joi.string().guid({ version: 'uuidv4' }).label('Address book ID').example('ev30v086-a381-4fd6-ca55-7af017d25825');

const contact = Joi.object({
    name: Joi.string().required().label('Contact name'),
    phoneNumber: Joi.string().required().label('Contact phone number'),
    addressBookId
}).required().label('Contact details');

const contactsList = Joi.array().items(contact).required().label('List of contacts');

const params = {
    getContacts: Joi.object({ addressBookId })
}

module.exports = {
    contact,
    contactsList,
    params
};
