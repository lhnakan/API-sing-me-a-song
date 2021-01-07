'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("genre_recommend", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      genreId: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'genres', key: 'id'}
      }, 
      recommendationId: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'recommendations', key: 'id'}
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('genre_recommend');
  }
};
