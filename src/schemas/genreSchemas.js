const joi = require('joi');

module.exports = joi.object({
    name: joi.string().pattern(/^[a-zA-Z\s]+$/).required()
});