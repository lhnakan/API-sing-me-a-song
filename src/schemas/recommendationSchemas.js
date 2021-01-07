const joi = require('joi');

const newRecommend = joi.object({
    name: joi.string().required(), 
    genresIds: joi.array().required(), 
    youtubeLink: joi.string().uri().required()
});

module.exports = {
    newRecommend
}