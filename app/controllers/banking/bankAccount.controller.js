const aqp = require('api-query-params');
const bankAccount = require('../../models/mongoose/banking/bankAccount.mongoose');
const stringHelper = require('../../helpers/string.helper');
const thirdParty = require('../../models/mongoose/system/thirdParty.mongoose');
const balanceRequest = require('../../models/mongoose/banking/balanceRequest.mongoose');
const bcrypt = require('bcryptjs');
const CryptoJS = require("crypto-js");
const _response = require('../../middlewares/_response');
const autoBind = require('auto-bind');


class BankAccountController {
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
            return _response(res, 401,"Unauthorized.", null, null);
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
            return _response(res, 401,"Unauthorized.", null, null);
        }
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

            const codeAscii = new Buffer.from(text, 'base64');
            const codeAsciiString = codeAscii.toString();

            const foundBankAccount = await bankAccount
                .findOne({account_number: codeAsciiString});

            if (!foundBankAccount) return  _response(res, 200, false, "Account Not Found");

            const sh = new stringHelper();
            const code = await sh.randomString(64);
            const codeBase64 = new Buffer.from(code);


            const createdBalanceRequestData = {
                code: code,
                bank_account: foundBankAccount._id,
                status: 0
            };

            const response = {
                request_id: codeBase64.toString('base64')
            };
            const createdBankAccount = balanceRequest(createdBalanceRequestData);
            await createdBankAccount.save();

            _response(res, 201, "Request Created", null, response);
        } catch (error) {
            console.log(error);
            _response(res, 500,"Something Error", null, null);
        }
    }

    async store (req, res) {
        if (req.user === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
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
