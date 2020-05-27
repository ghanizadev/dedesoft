const {Model, DataTypes} = require('sequelize');

class Seller extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            code: DataTypes.STRING,
            role: DataTypes.STRING,
        },{
            sequelize
        });
    }

    static associate(models) {
        this.hasMany(models.Sale, { foreignKey: 'seller_id', as: 'sales' })
    }
}

module.exports = Seller;