const joi = require('joi');

const newGenre = joi.object({
    name: joi.string().pattern(/^[a-zA-Z\s]+$/).required()
})

module.exports = { newGenre };