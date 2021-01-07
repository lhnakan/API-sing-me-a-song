const Op = require('sequelize').Op;
const Recommendation = require('../models/Recommendation');
const Genre = require('../models/Genre');
const GenreRecommend = require('../models/GenreRecommend');
const recommendationSchemas = require('../schemas/recommendationSchemas');
const sanitiseObjStrings = require('../utils/stringStrip');
const helper = require('../helpers/recommendationsHelper');

async function create(req, res) {
    const sanitisedBody = sanitiseObjStrings(req.body);

    const { error } = recommendationSchemas.newRecommend.validate(sanitisedBody);
    if(error) return res.status(422).json({ error: error.details[0].message });

    const { name, youtubeLink, genresIds } = sanitisedBody;

    try {
        const checkGenre = await Genre.findAll({
            where: {
                id: {
                    [Op.in]: genresIds
                }
            }
        })
        if(checkGenre.length === 0) return res.sendStatus(406)
        
        const [recommend, created] = await Recommendation.findOrCreate({
            where: { url: youtubeLink }, 
            defaults: { name, url: youtubeLink }
        });

        if(!created) {
            const result = await Recommendation.findByPk(recommend.id, {
                include: {
                    model: Genre, 
                    through: {
                        attributes: []
                    }
                }
            })
            return res.status(202).send(result);
        }
        
        const formatedArray = helper.formatToAddInTable(checkGenre, recommend.id)

        const attMiddleTable = await GenreRecommend.bulkCreate(formatedArray)

        return res.send(attMiddleTable);
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

module.exports = { create };