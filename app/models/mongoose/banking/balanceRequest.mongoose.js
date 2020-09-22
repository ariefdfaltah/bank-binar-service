const collection = require('mongoose');
const Schema = collection.Schema;
const basicData = require('../../data/system/basic.data');

const balanceRequestSchema = new collection.Schema(
    {
            code: basicData.code("Transaksi"),
            bank_account: {
                    type: Schema.Types.ObjectId,
                    required: false,
                    ref : 'BankAccount',
                    autopopulate : {
                            select: 'name account_number transaction_pin',
                            maxDepth: 1
                    }
            },
            status: basicData.status
    });

balanceRequestSchema.set('timestamps', true);
balanceRequestSchema.plugin(require('mongoose-paginate-v2'));
balanceRequestSchema.plugin(require('mongoose-autopopulate'));

module.exports = collection.model('BalanceRequest', balanceRequestSchema);
