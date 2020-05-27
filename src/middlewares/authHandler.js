const jwt = require("jsonwebtoken");

module.exports = (role = []) => {
    return async (req, res, next) => {
        try {
            if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
                return res.sendStatus(403);
        
            const user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SALT);
        
            if(user && role.includes(user.role)){
                return next();
            }else {
                return res.sendStatus(401);
            }
        }catch(e){
            console.log(e.message);
            res.sendStatus(401);
        }
    }
}