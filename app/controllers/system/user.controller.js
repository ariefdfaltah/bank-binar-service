const user = require('../../models/mongoose/system/user.mongoose');
const _response = require('../../middlewares/_response');
const bcrypt = require('bcryptjs');
const autoBind = require('auto-bind');


class UserController {
    constructor() {
        autoBind(this);
    }

    async store (req, res) {
        if (req.user === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
        try {
            const rawData = req.body.data;
            if (rawData === {} || rawData === undefined) { return _response(res, 401, "Unauthorized - cx1", null, null); }

            const createdUserData = req.body;

            const salt = await bcrypt.genSalt(10);
            createdUserData.password = await bcrypt.hash(req.body.password, salt);

            const createdUser = user(createdUserData);
            await createdUser.save();

            return _response(res, 201, true, "Data Created", {}, createdUser);
        } catch (error) {
            console.log(error);
            return _response(res, 500, false, "Something Error");
        }
    }
}

module.exports = UserController;
