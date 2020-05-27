const Sequelize = require("sequelize");
const init = require("../config/init");
const Sale = require("../models/Sale");
const Seller = require("../models/Seller");
const Umzug = require('umzug');
const path = require('path');

require('./migrations/20200425165840-create-sellers');
require('./migrations/20200425170402-create-sales');
require('./migrations/20200427195929-create-admin');

const connection = new Sequelize(init);

const runMigrations = () => {
const umzug = new Umzug({
  storage: "sequelize",

  storageOptions: {
    sequelize: connection
  },

  migrations: {
    params: [
      connection.getQueryInterface(),
      Sequelize
    ],
    path: path.join(__dirname, "./migrations")
  }
});

return umzug.up();
}

Seller.init(connection);
Sale.init(connection);

Seller.associate(connection.models);
Sale.associate(connection.models);


module.exports = {connection, runMigrations};