const {Model, DataTypes} = require('sequelize');

class Sale extends Model {
    static init(sequelize){
        super.init({
            value: DataTypes.FLOAT,
            code: DataTypes.STRING,
            paid: DataTypes.BOOLEAN,
        },{
            sequelize
        });
    }

    static associate(models) {
        this.belongsTo(models.Seller, { foreignKey: 'seller_id', as: 'sales' })
    }
}

module.exports = Sale;