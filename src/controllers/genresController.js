const Op = require('sequelize').Op;
const Genre = require('../models/Genre');

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
}

module.exports = new genresController();