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
        if (req.user === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
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
            return _response(res, 500, "Something Error", null, null);
        }
    }

    async showForm (req, res) {
        if (req.user === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
        try {
            return _response(res, 200,"Data Found", null, await thirdPartyData.thirdPartyScheme());
        } catch (error) {
            console.log(error);
            return _response(res, 500,"Something Error", null, null);
        }
    }

    async authorize (req, res) {
        try {
            const rawData = req.body.data;
            if (rawData === {} || rawData === undefined) { return _response(res, 401, "Unauthorized - cx1", null, null); }

            const rawDataAscii = new Buffer.from(rawData, 'base64');
            const rawDataAsciiString = rawDataAscii.toString();
            const credentials = rawDataAsciiString.split(":");
            if (credentials[0] === "" || credentials[1] === "" || credentials[0] === undefined || credentials[1] === undefined) { return _response(res, 401, "Unauthorized - cx2", null, null); }

            const clientKeyAscii = new Buffer.from(credentials[1], 'base64');
            const clientKeyAsciiString = clientKeyAscii.toString();
            const foundThirdParty= await thirdParty
                .findOne({public_key: clientKeyAsciiString});
            if (!foundThirdParty) return _response(res, 401, "Unauthorized - ax1", null, null);

            const password = foundThirdParty.secret_key;
            const cryptoStr = credentials[0];
            const bytes2 = CryptoJS.AES.decrypt(cryptoStr, password);
            const text = bytes2.toString(CryptoJS.enc.Utf8);

            const applicationCredentials = text.split(":");

            const codeAscii = new Buffer.from(applicationCredentials[0], 'base64');
            const codeAsciiString = codeAscii.toString();

            const passwordAscii = new Buffer.from(applicationCredentials[1], 'base64');
            const passwordAsciiString = passwordAscii.toString();

            const foundApplication = await application.findOne({code: codeAsciiString});
            if(!foundApplication) return _response(res, 401, "Unauthorized - ax2", null, null);

            const validPassword = await bcrypt.compare(passwordAsciiString, foundApplication.password);
            if(!validPassword) return _response(res, 401, "Unauthorized - ax3", null, null);

            const newToken = jwt.sign({_id: foundThirdParty._id, concern: 'thirdParty'}, process.env.JWT_SECRET, { expiresIn: '1h' });

            const data = {
                auth_token: newToken,
            };
            return _response(res, 200, "Data Found", null, data);
        } catch (error) {
            console.log(error);
            return _response(res, 500,"Something Error", null, null);
        }
    }

    async show (req, res) {
        if (req.user === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
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

            if (!foundThirdParty) return  _response(res, 422, false, "Data Not Found");

            return _response(res, 200, "Data Found", null, foundThirdParty);
        } catch (error) {
            console.log(error);
            return _response(res, 500,"Something Error", null, null);
        }
    }

    async store (req, res) {
        if (req.user === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
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

            return _response(res, 201,  "Data Created", null, createdThirdParty);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
    }
}

module.exports = ThirdPartyController;
