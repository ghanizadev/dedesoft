const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    async login(req, res, next) {
        if(!req.body.username || !req.body.password)
            next({
                error: 'unauthorized',
                error_description: 'Missing username or password field.',
                status: 403
            });

        const seller = await Seller.findOne({where: { code: req.body.username }});

        const hashedPassword = await bcrypt.hash(req.body.password, process.env.HASH_SALT);

        if (seller.password === hashedPassword) {
            const {id, name, code, role} = seller;
            const token = jwt.sign({id, code, role, name}, process.env.SALT);

            res.status(200).send({access_token: token});
        }else {
            res.sendStatus(401);
        }
    },
    async resetPassword(req, res, next) {
        if(!req.body.username || !req.body.password || !req.body.code)
            next({
                error: 'invalid_request',
                error_description: 'Missing username, password or code field.',
                status: 422
            });

        const seller = await Seller.findOne({where: { code: req.body.username }});

        const hash = bcrypt.hashSync(req.body.username + seller.updatedAt, process.env.HASH_SALT);

        if(hash === req.body.code){
            seller.update({password: bcrypt.hashSync(req.body.password, process.env.HASH_SALT)})
            res.sendStatus(204)
        }else {
            res.sendStatus(403);
        }
    },
    async makeCode(req, res, next) {
        if(!req.body.username)
            next({
                error: 'unauthorized',
                error_description: 'Missing username field.',
                status: 422
            });

        const seller = await Seller.findOne({where: { code: req.body.username }});

        if(!seller){
            res.sendStatus(404);
        }else {
            const hash = bcrypt.hashSync(req.body.username + seller.updatedAt, process.env.HASH_SALT);
            res.status(200).send({code: hash, username: req.body.username});
        }
    }
}