const jwt = require('jsonwebtoken');


module.exports = async function auth (req, res, next){
    try {
        const authorization = req.header('Authorization');
        if(!authorization) return res.status(401).send({status:false,message: "Unauthorized."});

        const token = authorization.split('Bearer ');

        const data = jwt.verify(token[1], process.env.JWT_SECRET);
        if (data.concern === 'application') {
            req.application = data
        } else {
            req.user = data
        }
        next();
    } catch (error){
        console.log(error);
        res.status(401).send({status:false,message: "Unauthorized."});
    }
};
