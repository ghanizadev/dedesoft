const Sequelize = require("sequelize");
const init = require("../config/init");
const Sale = require("../models/Sale");
const Seller = require("../models/Seller");

const connection = new Sequelize(init);

Seller.init(connection);
Sale.init(connection);

Seller.associate(connection.models);
Sale.associate(connection.models);


module.exports = connection;