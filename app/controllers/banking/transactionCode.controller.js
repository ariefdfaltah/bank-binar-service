const aqp = require('api-query-params');
const transactionCode = require('../../models/mongoose/banking/transactionCode.mongoose');
const _response = require('../../middlewares/_response');
const autoBind = require('auto-bind');


class TransactionCodeController {
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

            const { docs: data, ...meta } = await transactionCode
                .paginate(filter, options);

            return _response(res, 200, "Data Found", meta, data);
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

            const foundTransactionCode = await transactionCode
                .findById(req.params.id, {}, options);

            if (!foundTransactionCode) return  _response(res, 200, false, "Data Not Found");

            return _response(res, 200, "Data Found", null, foundTransactionCode);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
    }

    async store (req, res) {
        if (req.user === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
        try {
            const createdTransactionCodeData = req.body;

            const createdTransactionCode = transactionCode(createdTransactionCodeData);
            await createdTransactionCode.save();

            return _response(res, 201, "Data Created", null, createdTransactionCode);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
    }
}

module.exports = TransactionCodeController;
