const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class GenreRecommend extends Sequelize.Model {};

GenreRecommend.init(
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        genreId: {
            type: Sequelize.INTEGER, 
            allowNull: false
        }, 
        recommendationId: {
            type: Sequelize.INTEGER, 
            allowNull: false
        }
    },{
        sequelize, 
        timestamps: false,
        modelName: "genreRecommend",
        tableName: 'genre_recommend'
    }
);

module.exports = GenreRecommend;