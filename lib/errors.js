'use strict';

/**
 * @module
 */

/**
 * @class SymbolError
 * @classdesc Used to represent application specific exceptions.
 */
class SymbolError extends Error {
    /**
     * Create an error instance with the given code and message.
     *
     * @param {Symbol|String} code - The error code.
     * @param {String} [message] - A description of the error.
     */
    constructor(code, message) {
        super(message);
        Error.captureStackTrace(this, SymbolError);

        if (code === undefined && process.env.NODE_ENV === 'test') {
            throw new SymbolError(Symbol('CODE_UNDEFINED'), 'Error code is undefined');
        }

        this.code = code;
    }

    /**
     * Return a string representation of the error.
     *
     * @returns {string} The string representation of the error code.
     */
    toString() {
        const code = typeof this.code === 'symbol'
            ? this.code.toString().slice(7, -1).toLowerCase().replace(/_/g, ' ')
            : `${this.code}`;


        return this.message ? `${code}: ${this.message}` : code;
    }
}

global.SymbolError = SymbolError;
