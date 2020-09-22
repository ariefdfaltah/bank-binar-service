const aqp = require('api-query-params');
const thirdParty = require('../../models/mongoose/system/thirdParty.mongoose');
const thirdPartyData = require('../../models/data/system/thirdParty.data');
const application = require('../../models/mongoose/entity/application.mongoose');
const _response = require('../../middlewares/_response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const autoBind = require('auto-bind');


class ThirdPartyController {
    constructor() {
        autoBind(this);
    }

    async index(req, res) {
        try {
            const { page = 1, ...query } = req.query;
            const { filter, limit = 10, sort, projection, population } = aqp(query);

            const options = {
                page: parseInt(page),
                limit,
                sort,
                select: projection,
                populate: population,
            };

            const { docs: data, ...meta } = await thirdParty
                .paginate(filter, options);

            return _response(res, 200, "Data Found", meta, data);
        } catch (error) {
            console.log(error);
            _response(res, 500, "Something Error", null, null);
        }
    }

    async showForm (req, res) {
        try {
            _response(res, 200,"Data Found", null, await thirdPartyData.thirdPartyScheme());
        } catch (error) {
            console.log(error);
            _response(res, 500,"Something Error", null, null);
        }
    }

    async authorize (req, res) {
        try {
            const token = req.header('Authorization').split("Bearer ");
            const credentials = token[1].split(":");
            if (credentials[0] === "" || credentials[1] === "") { return _response(res, 401, true, "Unauthorized", meta, {}); }
            const b = new Buffer.from(credentials[0], 'base64');
            const public_key = b.toString();

            const foundThirdParty= await thirdParty
                .findOne({public_key: public_key}, {}, {});

            if (!foundThirdParty) return _response(res, 401, false, "Unauthorized - ax1");

            const password = foundThirdParty.secret_key;
            const cryptoStr = credentials[1];

            const bytes2 = CryptoJS.AES.decrypt(cryptoStr, password);
            const text = bytes2.toString(CryptoJS.enc.Utf8);

            const applicationCredentials = text.split(":");

            const foundApplication = await application.findOne({code: applicationCredentials[0]});
            if(!foundApplication) return _response(res, 401, false, "Unauthorized - ax2");

            const validPassword = await bcrypt.compare(applicationCredentials[1], foundApplication.password);
            if(!validPassword) return _response(res, 401, false, "Unauthorized - ax3");

            const newToken = jwt.sign({_id: foundThirdParty._id}, process.env.JWT_SECRET, { expiresIn: '1h' });

            const data = {
                auth_token: newToken,
            };

            _response(res, 200, "Data Found", null, data);
        } catch (error) {
            console.log(error);
            _response(res, 500,"Something Error", null, null);
        }
    }

    async show (req, res) {
        try {
            const { projection, population } = aqp(req.query);

            const options = {};
            if (projection) {
                options.autopopulate = false;
                options.select = projection
            }
            if (population) {
                options.populate = population
            }

            const foundThirdParty= await thirdParty
                .findById(req.params.id, {}, options);

            if (!foundThirdParty) return  _response(res, 200, false, "Data Not Found");

            _response(res, 200, "Data Found", null, foundThirdParty);
        } catch (error) {
            console.log(error);
            _response(res, 500,"Something Error", null, null);
        }
    }

    async store (req, res) {
        try {
            const createdThirdPartyData = req.body;

            const foundApplication = await application.findById(req.body.application);
            if(!foundApplication) return _response(res, 422, "Unprocessable Entity - ax1", null, null);


            const salt = await bcrypt.genSalt(10);
            createdThirdPartyData.name = foundApplication.name;
            createdThirdPartyData.public_key = await bcrypt.hash(foundApplication.name, salt);
            createdThirdPartyData.secret_key = await bcrypt.hash(foundApplication.name + foundApplication.name, salt);
            createdThirdPartyData.status = 1;

            const createdThirdParty = thirdParty(createdThirdPartyData);
            await createdThirdParty.save();

            _response(res, 201,  "Data Created", null, createdThirdParty);
        } catch (error) {
            console.log(error);
            _response(res, 500, "Something Error", null, null);
        }
    }
}

module.exports = ThirdPartyController;
