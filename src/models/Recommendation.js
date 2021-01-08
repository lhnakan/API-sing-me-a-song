const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Recommendation extends Sequelize.Model {};

Recommendation.init(
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        score: {
            type: Sequelize.INTEGER, 
            defaultValue: 0
        }
    },{
        sequelize, 
        timestamps: false,
        modelName: "recommendation"
    }
);

module.exports = Recommendation;