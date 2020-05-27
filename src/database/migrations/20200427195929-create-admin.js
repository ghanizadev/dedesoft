'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
        'sellers',
        [{
          name: 'Administrador',
          password: bcrypt.hashSync('admin', process.env.HASH_SALT),
          code: 'admin',
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        }]
      )
  
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('sellers', null, {});
  }
};
