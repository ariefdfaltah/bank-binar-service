const user = require('../../models/mongoose/system/user.mongoose');
const _response = require('../../middlewares/_response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const autoBind = require('auto-bind');


class AuthController {
    constructor() {
        autoBind(this);
    }

    async login (req, res) {
        try {
            const foundUser = await user.findOne({email: req.body.email});
            if(!foundUser) return _response(res, 422, "User not Found", null, null);

            const validPassword = await bcrypt.compare(req.body.password, foundUser.password);
            if(!validPassword) return _response(res, 422, "User not Found", null, null);

            const token = jwt.sign({_id: foundUser._id, concern: 'user'}, process.env.JWT_SECRET, { expiresIn: '1h' });

            const data = {
                token
            };

            return _response(res, 200, "Success", null, data);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
    }
}

module.exports = AuthController;
