'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("recommendations", {
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('recommendations');
  }
};
