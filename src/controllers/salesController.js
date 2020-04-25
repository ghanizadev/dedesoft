const Sale = require('../models/Sale');
const Seller = require('../models/Seller');

module.exports = {
    async create(req, res, next) {
        const { value, code } = req.body;

        if(value !== '' && code !== ''){
            const seller = await Seller.findByPk(req.params.seller_id);

            if(!seller) 
                return next({
                        error: 'invalid_request',
                        error_description: 'Seller does not exist.',
                        status: 422
                });

            const sale = await Sale.create({seller_id: req.params.seller_id, value, code});;

            return res.status(201).send(sale);
        }else {
            next({
                error: 'invalid_request',
                error_description: 'Fields "value" and "code" cannot be empty.',
                status: 422
            });
        }
    },
    async list(req, res, next) {

        let sales = await Sale.findAll({ where: req.query });

        return res.status(200).send(sales);
    },
    async delete(req, res, next) {

        let sale = await Sale.destroy({where: {id: req.params.id}})

        return res.status(200).send(sale);
    }
}