const Recommendation = require('../models/Recommendation');
const Genre = require('../models/Genre');
const GenreRecommend = require('../models/GenreRecommend');
const helper = require('../helpers/recommendationsHelper');
const NotFound = require('../errors/NotFound');
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
        if(!result) throw new NotFound();
        
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
        if(!result) throw new NotFound();

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
        
        let result = await Recommendation.findOne({
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
        if(!result) {
            result = await Recommendation.findOne({
                include: {
                    model: Genre, 
                    through: { attributes: [] }
                },
                order: [Sequelize.fn('RANDOM')]
            });
            if(!result) throw new NotFound();
        };

        return result ;
    }

    async randomInGenre(id){
        const drawScore = helper.draw(10, 1);
        const range = drawScore > 3 ? [11, 999] : [-5, 10] ;
        
        let result = await Recommendation.findOne({
            include: {
                model: Genre, 
                through: { attributes: [] },
                where: { id }
            },
            where: { 
                score: { 
                    [Op.between]: range
                },
            }, 
            order: [Sequelize.fn('RANDOM')]
        });
        
        if(!result) {
            result = await Recommendation.findOne({
                include: {
                    model: Genre, 
                    where: { id }, 
                    through: { attributes: [] }
                }, 
                order: [Sequelize.fn('RANDOM')]
            });
            if(!result) throw new NotFound();
        };

        const toSend = await Recommendation.findByPk(result.id, {
            include: {
                model: Genre, 
                through: { attributes: [] }
            }
        })
        
        return toSend;
    }

    async topScores(amount) {
        const result = await Recommendation.findAll({
            include: {
                model: Genre,
                through: { attributes: [] }
            },
            limit: amount,
            order: [
                ['score', 'DESC'] 
            ]
        })
        if(result.length === 0) throw new NotFound();
        return result;
    }
}

module.exports = new recommendationsController();