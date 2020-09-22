const collection = require('mongoose');
const Schema = collection.Schema;
const basicData = require('../../data/system/basic.data');

const transferRequestSchema = new collection.Schema(
    {
            code: basicData.code("Transaksi"),
            nominal: basicData.custom_number("Nominal", "nominal"),
            bank_account_origin: {
                    type: Schema.Types.ObjectId,
                    required: false,
                    ref : 'BankAccount',
                    autopopulate : {
                            select: 'name account_number transaction_pin balance',
                            maxDepth: 1
                    }
            },
            bank_account_destination: {
                    type: Schema.Types.ObjectId,
                    required: false,
                    ref : 'BankAccount',
                    autopopulate : {
                            select: 'name account_number transaction_pin balance',
                            maxDepth: 1
                    }
            },
            status: basicData.status
    });

transferRequestSchema.set('timestamps', true);
transferRequestSchema.plugin(require('mongoose-paginate-v2'));
transferRequestSchema.plugin(require('mongoose-autopopulate'));

module.exports = collection.model('TransferRequest', transferRequestSchema);
