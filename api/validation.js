'use strict';

const Joi = require('joi');

/**
 * @module
 */
module.exports = {
    statusCode: {
        400: Joi.object({
            statusCode: Joi.number().valid(400).required(),
            error: Joi.string().required().example('Bad Request'),
            message: Joi.string().example('Invalid request payload input'),
            validation: Joi.object({
                source: Joi.string().required().example('payload'),
                keys: Joi.array().items(Joi.string()).example('["emailAddress"]')
            })
        }).label('Bad Request'),

        404: Joi.object({
            statusCode: Joi.number().valid(404).required(),
            error: Joi.string().required().example('Not Found'),
            message: Joi.string().example('Requested resource could not be found')
        }).label('Not Found')
    }
};
