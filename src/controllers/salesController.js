const Sale = require('../models/Sale');
const Seller = require('../models/Seller');
const {Op} = require('sequelize');

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
    async listAll(req, res, next) {
        let where = {};
        if(req.body.startDay && req.body.endDay){
            where = {
                createdAt: {
                    [Op.between]: [req.body.startDay, req.body.endDay],
                }
            }
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;

        const data = await Sale.findAndCountAll();

        let pages = Math.ceil(data.count / limit);
        let offset = limit * (page - 1);

        const sales = await Sale.findAll({
            attributes: [
                "id",
                "code",
                "value",
                "createdAt",
                "updatedAt",
                "paid"
            ],
            offset,
            limit,
            include: {association: 'seller', attributes: ['id', 'name']},
            where,
            order: [
                ['createdAt', 'DESC'],
            ],
        })

        return res.status(200).send({
            docs: sales,
            pages,
            currentPage: page,
            limit,
            offset,
            count: (limit * (page - 1) + sales.length),
            totalCount: data.count,
        });
    },
    async listId(req, res, next) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;

        const seller = Seller.findOne({where : {id: req.params.seller_id}});

        if(!seller)
            return next({
                status: 403,
                error: "forbidden",
                error_description: "Seller not found."
            })

        const data = await Sale.findAndCountAll({where : {seller_id: req.params.seller_id}});

        let pages = Math.ceil(data.count / limit);
        let offset = limit * (page - 1);

        const sales = await Sale.findAll({
            attributes: [
                "id",
                "code",
                "value",
                "createdAt",
                "updatedAt",
                "paid"
            ],
            offset,
            limit,
            where : {seller_id: req.params.seller_id},
            order: [
                ['createdAt', 'DESC'],
            ],
        })

        return res.status(200).send({
            docs: sales,
            pages,
            currentPage: page,
            limit,
            offset,
            count: (limit * (page - 1) + sales.length),
            totalCount: data.count,
        });
    },
    async listSingle(req, res, next) {

        const data = await Sale.findOne({
            where : { code: req.params.id},
            attributes: [
                "id",
                "code",
                "value",
                "createdAt",
                "updatedAt",
                "paid"
            ],
            include: {association: 'seller', attributes: ['id', 'name', 'role']},

        });
        return res.status(200).send(data);

    },
    async listMonth(req, res, next) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;

        const data = await Sale.findAndCountAll();

        let pages = Math.ceil(data.count / limit);
        let offset = limit * (page - 1);

        const sales = await Sale.findAll({
            attributes: [
                "id",
                "code",
                "value",
                "createdAt",
                "updatedAt",
                "paid"
            ],
            offset,
            limit,
            include: {association: 'seller', attributes: ['id', 'name']}
        })

        return res.status(200).send({
            docs: sales,
            pages,
            currentPage: page,
            limit,
            offset,
            count: (limit * (page - 1) + sales.length),
            totalCount: data.count,
        });
    },
    async listDay(req, res, next) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;

        const data = await Sale.findAndCountAll();

        let pages = Math.ceil(data.count / limit);
        let offset = limit * (page - 1);

        const sales = await Sale.findAll({
            attributes: [
                "id",
                "code",
                "value",
                "createdAt",
                "updatedAt",
                "paid"
            ],
            offset,
            limit,
            include: {association: 'seller', attributes: ['id', 'name']}
        })

        return res.status(200).send({
            docs: sales,
            pages,
            currentPage: page,
            limit,
            offset,
            count: (limit * (page - 1) + sales.length),
            totalCount: data.count,
        });
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

        sale.update(req.body);

        return res.status(200).send(sale);
            
    }
}