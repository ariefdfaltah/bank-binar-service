const aqp = require('api-query-params');
const bankAccount = require('../../models/mongoose/banking/bankAccount.mongoose');
const balanceRequest = require('../../models/mongoose/banking/balanceRequest.mongoose');
const bcrypt = require('bcryptjs');
const _response = require('../../middlewares/_response');
const autoBind = require('auto-bind');


class BankAccountController {
    constructor() {
        autoBind(this);
    }

    async index(req, res) {
        if (req.user === undefined) {
            _response(res, 401,"Unauthorized.", null, null);
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

            const { docs: data, ...meta } = await bankAccount
                .paginate(filter, options);

            return _response(res, 200, "Data Found", meta, data);
        } catch (error) {
            console.log(error);
            _response(res, 500, "Something Error", null, null);
        }
    }

    async show (req, res) {
        if (req.user === undefined) {
            _response(res, 401,"Unauthorized.", null, null);
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

            const foundBankAccount = await bankAccount
                .findById(req.params.id, {}, options);

            if (!foundBankAccount) return  _response(res, 200, false, "Data Not Found");

            _response(res, 200, "Data Found", null, foundBankAccount);
        } catch (error) {
            console.log(error);
            _response(res, 500, "Something Error", null, null);
        }
    }

    async profile (req, res) {
        if (req.thirdParty === undefined) {
            _response(res, 401,"Unauthorized.", null, null);
        }
        try {
            const foundApplication= await thirdParty
                .findOne({application: req.application._id});

            if (!foundApplication) return  _response(res, 200,"Data Not Found", null, null);

            _response(res, 200, "Data Found", null, foundApplication);
        } catch (error) {
            console.log(error);
            _response(res, 500,"Something Error", null, null);
        }
    }

    async balance (req, res) {
        if (req.thirdParty === undefined) {
            _response(res, 401,"Unauthorized.", null, null);
        }
        try {


            const createdBalanceRequestData = {

            }

            const createdBankAccount = balanceRequest(createdBalanceRequestData);
            await createdBankAccount.save();


            const foundApplication= await balanceRequest
                .findOne({application: req.application._id});

            if (!foundApplication) return  _response(res, 200,"Data Not Found", null, null);

            _response(res, 200, "Data Found", null, foundApplication);
        } catch (error) {
            console.log(error);
            _response(res, 500,"Something Error", null, null);
        }
    }

    async store (req, res) {
        if (req.user === undefined) {
            _response(res, 401,"Unauthorized.", null, null);
        }
        try {
            const createdBankAccountData = req.body;

            console.log(createdBankAccountData);

            const salt = await bcrypt.genSalt(10);
            createdBankAccountData.transaction_pin = await bcrypt.hash(req.body.transaction_pin, salt);

            const createdBankAccount = bankAccount(createdBankAccountData);
            await createdBankAccount.save();

            _response(res, 201, "Data Created", null, createdBankAccount);
        } catch (error) {
            console.log(error);
            _response(res, 500, "Something Error", null, null);
        }
    }
}

module.exports = BankAccountController;
