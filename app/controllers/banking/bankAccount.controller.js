const aqp = require('api-query-params');
const bankAccount = require('../../models/mongoose/banking/bankAccount.mongoose');
const stringHelper = require('../../helpers/string.helper');
const thirdParty = require('../../models/mongoose/system/thirdParty.mongoose');
const balanceRequest = require('../../models/mongoose/banking/balanceRequest.mongoose');
const transferRequest = require('../../models/mongoose/banking/transferRequest.mongoose');
const transactionHistory = require('../../models/mongoose/banking/transactionHistory.mongoose');
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

            const foundBankAccount = await bankAccount
                .findById(req.params.id, {}, options);

            if (!foundBankAccount) return  _response(res, 422,"Data Not Found", null, null);

            return _response(res, 200, "Data Found", null, foundBankAccount);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
    }

    async profile (req, res) {
        if (req.thirdParty === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
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

            if (!foundBankAccount) return  _response(res, 422, "Account not Found", null, null);

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
            const createdBalanceRequest = balanceRequest(createdBalanceRequestData);
            await createdBalanceRequest.save();

            return _response(res, 201, "Request Created", null, response);
        } catch (error) {
            console.log(error);
            return _response(res, 500,"Something Error", null, null);
        }
    }

    async getBalance (req, res) {
        if (req.thirdParty === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
        try {
            const rawData = req.body.data;
            if (rawData === {} || rawData === undefined) { return _response(res, 401, "Unauthorized - cx1", null, null); }
            //
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
            // const xx = CryptoJS.AES.encrypt('dlRhckJvVUxiQ2h2YmI2bmU3TDB1QWlnSktyMzhIT1luUGJycnlXV3FZeG5UUkk2NnF3bWVRSDFjaklOOWxmTw==:OTQyODQx', password);
            // console.log(xx.toString())
            const cryptoStr = credentials[0];
            const bytes2 = CryptoJS.AES.decrypt(cryptoStr, password);
            const text = bytes2.toString(CryptoJS.enc.Utf8);

            const applicationCredentials = text.split(":");

            const requestCodeAscii = new Buffer.from(applicationCredentials[0], 'base64');
            const requestCodeAsciiString = requestCodeAscii.toString();

            const pinAscii = new Buffer.from(applicationCredentials[1], 'base64');
            const pinAsciiString = pinAscii.toString();

            const foundBalanceRequest = await balanceRequest
                .findOne({code: requestCodeAsciiString});

            if (!foundBalanceRequest) return  _response(res, 422, "Request not Found", null, null);

            if (foundBalanceRequest.status !== 0) return  _response(res, 422,"Request Expired", null, null);

            const validPassword = await bcrypt.compare(pinAsciiString, foundBalanceRequest.bank_account.transaction_pin);
            if(!validPassword) return _response(res, 401, "Unauthorized - ax3", null, null);

            const response = {
                balance: foundBalanceRequest.bank_account.balance
            };
            foundBalanceRequest.status = 1;
            await foundBalanceRequest.save();

            return _response(res, 201, "Success", null, response);
        } catch (error) {
            console.log(error);
            return _response(res, 500,"Something Error", null, null);
        }
    }

    async transfer (req, res) {
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
            // const xx = CryptoJS.AES.encrypt('MDgyMjI1OTQyODQx:MDgwOTg5OTk5:MTAwMDAwMA==', password);
            // console.log(xx.toString());
            const cryptoStr = credentials[0];
            const bytes2 = CryptoJS.AES.decrypt(cryptoStr, password);
            const text = bytes2.toString(CryptoJS.enc.Utf8);

            const transferRequestData = text.split(":");

            const originAscii = new Buffer.from(transferRequestData[0], 'base64');
            const originAsciiString = originAscii.toString();

            const destinationAscii = new Buffer.from(transferRequestData[1], 'base64');
            const destinationAsciiString = destinationAscii.toString();

            const nominalAscii = new Buffer.from(transferRequestData[2], 'base64');
            const nominalAsciiString = nominalAscii.toString();
            const nominalInt = parseInt(nominalAsciiString);

            if (nominalInt < 50000) return _response(res, 422, "Unprocessable Entity - Minimal Transfer Amount 50000 - ax1", null, null);

            const foundBankAccount = await bankAccount
                .findOne({account_number: originAsciiString});
            if (!foundBankAccount) return  _response(res, 422, "Origin Account not Found", null, null);

            const foundBankAccount2 = await bankAccount
                .findOne({account_number: destinationAsciiString});
            if (!foundBankAccount2) return  _response(res, 422, "Destination Account not Found", null, null);

            const sh = new stringHelper();
            const code = await sh.randomString(64);
            const codeBase64 = new Buffer.from(code);

            const createdTransferRequestData = {
                code: code,
                nominal: nominalInt,
                bank_account_origin: foundBankAccount._id,
                bank_account_destination: foundBankAccount2._id,
                status: 0
            };
            //
            const response = {
                request_id: codeBase64.toString('base64')
            };
            const createdTransferRequest = transferRequest(createdTransferRequestData);
            await createdTransferRequest.save();

            return _response(res, 201, "Request Created", null, response);
        } catch (error) {
            console.log(error);
            return _response(res, 500,"Something Error", null, null);
        }
    }

    async doTransfer (req, res) {
        if (req.thirdParty === undefined) {
            return _response(res, 401,"Unauthorized.", null, null);
        }
        try {
            const rawData = req.body.data;
            if (rawData === {} || rawData === undefined) { return _response(res, 401, "Unauthorized - cx1", null, null); }
            //
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
            // const xx = CryptoJS.AES.encrypt('ajZtUGlEZUdVQlRyMkZERTZOVFlYWms1cVR4UFhXaWVFTDVpMjgxZTNKV2U4OWVCUXlBc1pNVzFmeHBCczdJTQ==:OTQyODQx', password);
            // console.log(xx.toString());
            const cryptoStr = credentials[0];
            const bytes2 = CryptoJS.AES.decrypt(cryptoStr, password);
            const text = bytes2.toString(CryptoJS.enc.Utf8);

            const applicationCredentials = text.split(":");

            const requestCodeAscii = new Buffer.from(applicationCredentials[0], 'base64');
            const requestCodeAsciiString = requestCodeAscii.toString();

            const pinAscii = new Buffer.from(applicationCredentials[1], 'base64');
            const pinAsciiString = pinAscii.toString();

            const foundTransferRequest = await transferRequest
                .findOne({code: requestCodeAsciiString});

            if (!foundTransferRequest) return  _response(res, 422, "Request not Found", null, null);

            if (foundTransferRequest.status !== 0) return  _response(res, 422, false, "Request Expired", null);

            const validPassword = await bcrypt.compare(pinAsciiString, foundTransferRequest.bank_account_origin.transaction_pin);
            if(!validPassword) return _response(res, 401, "Unauthorized - ax3", null, null);

            const foundBankAccountOrigin = await bankAccount.findById(foundTransferRequest.bank_account_origin._id);
            if(!foundBankAccountOrigin) return _response(res, 401, "Unauthorized - ax4", null, null);

            const foundBankAccountDestination = await bankAccount.findById(foundTransferRequest.bank_account_destination._id);
            if(!foundBankAccountDestination) return _response(res, 401, "Unauthorized - ax5", null, null);

            const added = foundBankAccountDestination.balance + foundTransferRequest.nominal;
            const reduced = foundBankAccountOrigin.balance - foundTransferRequest.nominal;

            const addedData = {
                bank_account: foundBankAccountDestination._id,
                balance_before_transaction: foundBankAccountDestination.balance,
                balance_after_transaction: added,
                nominal_on_transaction: foundTransferRequest.nominal,
                code: '5f6a098f26674635192c006e'
            };

            const reducedData = {
                bank_account: foundBankAccountOrigin._id,
                balance_before_transaction: foundBankAccountOrigin.balance,
                balance_after_transaction: reduced,
                nominal_on_transaction: foundTransferRequest.nominal,
                code: '5f6a099b26674635192c006f'
            };

            foundBankAccountOrigin.balance = reduced;
            await foundBankAccountOrigin.save();
            foundBankAccountDestination.balance = added;
            await foundBankAccountDestination.save();

            const createdAddedData = transactionHistory(addedData);
            await createdAddedData.save();
            const createdReducedData = transactionHistory(reducedData);
            await createdReducedData.save();

            foundTransferRequest.status = 1;
            await foundTransferRequest.save();

            return _response(res, 201, "Success", null, null);
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
            const createdBankAccountData = req.body;

            const salt = await bcrypt.genSalt(10);
            createdBankAccountData.transaction_pin = await bcrypt.hash(req.body.transaction_pin, salt);

            const createdBankAccount = bankAccount(createdBankAccountData);
            await createdBankAccount.save();

            return _response(res, 201, "Data Created", null, createdBankAccount);
        } catch (error) {
            console.log(error);
            return _response(res, 500, "Something Error", null, null);
        }
    }
}

module.exports = BankAccountController;
