const Seller = require('../models/Seller');

module.exports = {
    async create(req, res, next) {
        const { name, password } = req.body;

        if(name !== '' && password !== ''){
            const seller = await Seller.create({name, password});

            const result = {
                id: seller.id,
                name: seller.name,
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt
            }

            return res.status(201).send(result);
        }else {
            next({
                error: 'invalid_request',
                error_description: 'Fields "name" and "password" cannot be empty.',
                status: 422
            });
        }
    },
    async list(req, res, next) {

        let seller = await Seller.findAll({
            attributes: ['id', 'name', 'created_at', 'updated_at'],
            where: req.query,
            include: {association: 'sales'}
        });

        return res.status(200).send(seller);
    },
    async alter(req, res, next) {

        
        let seller = await Seller.findByPk(req.params.id);
        
        if(!seller)
            return next({
                error: 'invalid_request',
                error_description: 'Sale does not exist.',
                status: 422
            });

        if(req.body.paid){
            seller.update(req.body)
        }

        return res.status(200).send(seller);
    },
    async delete(req, res, next) {

        let count = await Seller.destroy(req.params.id);

        if(count > 0)
            return res.status(200).send(sales);
        else
            next({
                error: 'invalid_request',
                error_description: 'Seller does not exist.',
                status: 422
            });
    }
}