const Sale = require('../models/Sale');
const Seller = require('../models/Seller');

module.exports = {
    async create(req, res, next) {
        const { value, code, paid } = req.body;

        if(value !== '' && code !== ''){
            const seller = await Seller.findByPk(req.params.seller_id);

            if(!seller) 
                return next({
                        error: 'invalid_request',
                        error_description: 'Seller does not exist.',
                        status: 422
                });

            const sale = await Sale.create({seller_id: req.params.seller_id, value, code, paid: paid || false});;

            return res.status(201).send(sale);
        } else
            next({
                error: 'invalid_request',
                error_description: 'Fields "value" and "code" cannot be empty.',
                status: 422
            });
    },
    async list(req, res, next) {

        let sales = await Sale.findAll({ where: req.query });

        return res.status(200).send(sales);
    },
    async delete(req, res, next) {

        let sale = await Sale.destroy({where: {id: req.params.id}});

        if(sale > 0)
            return res.sendStatus(204);
        else
            next({
                error: 'invalid_request',
                error_description: 'Sale does not exist.',
                status: 422
            });
    },
    async alter(req, res, next) {

        let sale = await Sale.findByPk(req.params.id);
        
        if(!sale)
            return next({
                error: 'invalid_request',
                error_description: 'Sale does not exist.',
                status: 422
            });

        if(req.body.paid){
            sale.update({paid : req.body.paid})
        }

        return res.status(200).send(sale);
            
    }
}