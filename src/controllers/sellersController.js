const Seller = require('../models/Seller');

module.exports = {
    async create(req, res, next) {
        const { name, password, code, role } = req.body;

        if(role && !['seller', 'cashier'].includes(role))
            next({
                error: 'invalid_request',
                error_description: 'Role must be either "cashier" or "seller".',
                status: 422
            });

        if(name !== '' && password !== ''){
            const seller = await Seller.create({name, password, code, role });

            const result = {
                id: seller.id,
                code: seller.code,
                role: seller.role,
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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;

        const data = await Seller.findAndCountAll();

        let pages = Math.ceil(data.count / limit);
        let offset = limit * (page - 1);

        let sellers = await Seller.findAll({
            attributes: [
                'id',
                'name',
                'code',
                'role',
                'created_at',
                'updated_at'
            ],
            offset,
            limit,
            include: {association: 'sales'}
        });

        return res.status(200).send({
            docs: sellers,
            pages,
            currentPage: page,
            limit,
            offset,
            count: (limit * (page - 1) + sellers.length),
            totalCount: data.count,
        });
    },
    async alter(req, res, next) {
        const {name, password, code, role} = req.body;
        let seller = await Seller.findByPk(req.params.id);
        
        if(!seller)
            return next({
                error: 'invalid_request',
                error_description: 'Seller does not exist.',
                status: 422
            });

        seller.update(req.body)

        return res.status(200).send(seller);
    },
    async delete(req, res, next) {
        let count = await Seller.destroy({where: {id: req.params.seller_id }});

        if(count > 0)
            return res.sendStatus(204);
        else
            next({
                error: 'invalid_request',
                error_description: 'Seller does not exist.',
                status: 422
            });
    }
}