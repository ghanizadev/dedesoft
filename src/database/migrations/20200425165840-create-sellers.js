'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const schema = { 
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      code: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }
    return queryInterface.createTable('sellers', schema);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sellers');
  }
};
