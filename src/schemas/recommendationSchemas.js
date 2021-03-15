const joi = require('joi');

const newRecommend = joi.object({
    name: joi.string().required(), 
    genresIds: joi.array().items(joi.number().min(1)).required(), 
    youtubeLink: joi.string().uri().required()
});

module.exports = {
    newRecommend
}