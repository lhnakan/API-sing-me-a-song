const Recommendation = require('../models/Recommendation');
const Genre = require('../models/Genre');
const GenreRecommend = require('../models/GenreRecommend');
const helper = require('../helpers/recommendationsHelper');
const NotFoundId = require('../errors/NotFoundId');
const Op = require('sequelize').Op;
const Sequelize = require('sequelize');

class recommendationsController {
    async create(name, youtubeLink, checkedIds) {
        const [recommend, created] = await Recommendation.findOrCreate({ 
            include: {
                model: Genre, 
                through: { attributes: [] }
            },
            where: { url: youtubeLink }, 
            defaults: { name, url: youtubeLink }
        });
        if(!created) return { result: recommend, created };

        if(checkedIds.length === 1) {
            await GenreRecommend.create({ 
                genreId: checkedIds[0].id, 
                recommendationId: recommend.id
            })
        } else {
            const formatedArray = helper.formatToAddInTable(checkedIds, recommend.id)
            await GenreRecommend.bulkCreate(formatedArray)
        }
        const result = await Recommendation.findByPk(recommend.id, {
            include: {
                model: Genre, 
                through: { attributes: [] }
            }
        })
        return { result, created };
    }

    async upScore(id) {
        const result = await Recommendation.findByPk(id, {
            include: {
                model: Genre, 
                through: { attributes: [] }
            },
        });        
        if(!result) throw new NotFoundId();
        
        result.score += 1;
        return await result.save();
    }

    async downScore(id) {
        const result = await Recommendation.findByPk(id, {
            include: {
                model: Genre, 
                through: { attributes: [] }
            }
        });
        if(!result) throw new NotFoundId();

        result.score -= 1;
        if(result.score < -5){
            await GenreRecommend.destroy({ where: { recommendationId: id } });
            await result.destroy();
            return
        }
        return await result.save()
    }

    async random(){
        const drawScore = helper.draw(10, 1);
        const range = drawScore > 3 ? [11, 999] : [-5, 10] ;
        
        let results = await Recommendation.findOne({
            where: { 
                score: { 
                    [Op.between]: range
                } 
            },
            include: {
                model: Genre, 
                through: { attributes: [] }
            },
            order: [Sequelize.fn('RANDOM')]
        });
        if(!results) {
            results = await Recommendation.findOne({
                include: {
                    model: Genre, 
                    through: { attributes: [] }
                },
                order: [Sequelize.fn('RANDOM')]
            });
            if(!results) throw new NotFoundId();
        };

        return results ;
    }

    async randomInGenre(id){
        const drawScore = helper.draw(10, 1);
        const range = drawScore > 3 ? [11, 999] : [-5, 10] ;
        
        let results = await Recommendation.findOne({
            include: {
                model: Genre, 
                through: { attributes: [] },
                where: { id: id }
            },
            where: { 
                score: { 
                    [Op.between]: range
                },
            }, 
            order: [Sequelize.fn('RANDOM')]
        });
        
        if(!results) {
            console.log('entrou')
            results = await Recommendation.findOne({
                include: {
                    model: Genre, 
                    where: { id }, 
                    through: { attributes: [] }
                }, 
                order: [Sequelize.fn('RANDOM')]
            });
            if(!results) throw new NotFoundId();
        };
        
        return results;
    }
}

module.exports = new recommendationsController();