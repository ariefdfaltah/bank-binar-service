const jwt = require('jsonwebtoken');
const thirdParty = require('../models/mongoose/system/thirdParty.mongoose');
const _response = require('../middlewares/_response');


module.exports = async function auth (req, res, next){
    try {
        const authorization = req.header('Authorization');
        if(!authorization) return _response(res, 401, "Unauthorized - mx1", null, null);

        const token = authorization.split('Bearer ');

        const data = jwt.verify(token[1], process.env.JWT_SECRET);
        if (data.concern === 'application') {
            req.application = data
        } else if (data.concern === 'thirdParty') {
            const foundThirdParty= await thirdParty
                .findById(data._id);
            if (!foundThirdParty) return _response(res, 401, "Unauthorized - mx2", null, null);
            req.thirdParty = foundThirdParty
            console.log(foundThirdParty)
        } else {
            req.user = data
        }
        next();
    } catch (error){
        console.log(error);
        return _response(res, 401, "Unauthorized - mx3", null, null);
    }
};
