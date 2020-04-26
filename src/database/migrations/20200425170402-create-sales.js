'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sales', { 
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      seller_id: {
        type: Sequelize.INTEGER,
        references: { model: 'sellers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sales');
  }
};
