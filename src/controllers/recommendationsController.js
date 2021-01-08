const Recommendation = require('../models/Recommendation');
const Genre = require('../models/Genre');
const GenreRecommend = require('../models/GenreRecommend');
const helper = require('../helpers/recommendationsHelper');

class recommendationsController {
    async create(name, youtubeLink, checkedIds) {
        const [recommend, created] = await Recommendation.findOrCreate({ 
            include: {
                model: Genre, 
                through: {
                    attributes: []
                }
            },
            where: { url: youtubeLink }, 
            defaults: { name, url: youtubeLink }
        });
        
        if(!created) return { result: recommend, created };

        let attMidlleTable;
        if(checkedIds.length === 1) {
            attMidlleTable = await GenreRecommend.create({ 
                genreId: checkedIds[0].id, 
                recommendationId: recommend.id
            })
        } else {
            const formatedArray = helper.formatToAddInTable(checkGenre, recommend.id)
            attMidlleTable = await GenreRecommend.bulkCreate(formatedArray)
        }
        
        const result = await Recommendation.findByPk(recommend.id, {
            include: {
                model: Genre, 
                through: {
                    attributes: []
                }
            }
        })
        return { result, created };
    }
}
module.exports = new recommendationsController();