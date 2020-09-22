const aqp = require('api-query-params');
const application = require('../../models/mongoose/entity/application.mongoose');
const applicationData = require('../../models/data/entity/application.data');
const thirdParty = require('../../models/mongoose/system/thirdParty.mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _response = require('../../middlewares/_response');
const autoBind = require('auto-bind');


class ApplicationController {
    constructor() {
        autoBind(this);
    }

    async login (req, res) {
        try {
            const foundApplication = await application.findOne({code: req.body.code});
            if(!foundApplication) return _response(res, 422, "Application not Found", null, null);

            const validPassword = await bcrypt.compare(req.body.password, foundApplication.password);
            if(!validPassword) return _response(res, 422, "User not Found", null, null);

            const token = jwt.sign({_id: foundApplication._id, concern: 'application'}, process.env.JWT_SECRET, { expiresIn: '1h' });

            const data = {
                token
            };

            return _response(res, 200, "Success", null, data);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
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

            const { docs: data, ...meta } = await application
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
            return _response(res, 200, "Data Found", null, await applicationData.applicationScheme());
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
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

            const foundApplication= await application
                .findById(req.params.id, {}, options);

            if (!foundApplication) return  _response(res, 422, "Data Not Found", null, null);

            return _response(res, 200, "Data Found", null, foundApplication);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
    }

    async profile (req, res) {
        try {
            const foundApplication= await thirdParty
                .findOne({application: req.application._id});

            if (!foundApplication) return  _response(res, 422,"Data Not Found", null, null);

            return _response(res, 200, "Data Found", null, foundApplication);
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
            const createdApplicationData = req.body;

            const salt = await bcrypt.genSalt(10);
            createdApplicationData.password = await bcrypt.hash(req.body.password, salt);

            const createdApplication = application(createdApplicationData);
            await createdApplication.save();

            return _response(res, 201, "Data Created", null, createdApplication);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
    }
}

module.exports = ApplicationController;
