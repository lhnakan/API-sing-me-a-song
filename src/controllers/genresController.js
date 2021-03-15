const Op = require('sequelize').Op;
const sequelize = require('sequelize');
const Genre = require('../models/Genre');
const Recommendation = require('../models/Recommendation');
const NotFound = require('../errors/NotFound');
const genresHelper = require('../helpers/genresHelper');

class genresController {
    async create(name) {
        return await Genre.findOrCreate({ where: { name } });
    }

    getAll() {
        return Genre.findAll({ order: ['name'] });
    }

    verifyGenres(genresIds) {
        return Genre.findAll({
            where: {
                id: {
                    [Op.in]: genresIds
                }
            }
        })
    }

    async getGenreRecommendations(id) {
        const result = await Genre.findOne({
            include: {
                model: Recommendation,
                through: { attributes: [] }, 
                include: {
                    model: Genre,
                    through: { attributes: [] },
                    required: false
                }
            },
            where: { id }
        })        
        if(!result) throw new NotFound();

        const score = genresHelper.sumTotalScore(result.recommendations);

        const toSend = {
            score,
            id: result.id, 
            name: result.name, 
            recommendations: result.recommendations
        }

        return toSend;
    }
}

module.exports = new genresController();