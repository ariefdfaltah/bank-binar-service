const collection = require('mongoose');
const Schema = collection.Schema;
const basicData = require('../../data/system/basic.data');

const transactionHistorySchema = new collection.Schema(
    {
        bank_account: {
            type: Schema.Types.ObjectId,
            required: false,
            ref : 'BankAccount',
            autopopulate : {
                select: 'name account_number',
                maxDepth: 1
            }
        },
        balance_before_transaction: basicData.custom_number('Saldo Sebelum Transaksi', 'balance_before_transaction'),
        balance_after_transaction: basicData.custom_number('Saldo Sebelum Transaksi', 'balance_after_transaction'),
        nominal_on_transaction: basicData.custom_number('Nominal Pada Transaksi', 'nominal_on_transaction'),
        code: {
            type: Schema.Types.ObjectId,
            required: false,
            ref : 'TransactionCode',
            autopopulate : {
                select: 'name code',
                maxDepth: 1
            }
        }
    });

transactionHistorySchema.set('timestamps', true);
transactionHistorySchema.plugin(require('mongoose-paginate-v2'));
transactionHistorySchema.plugin(require('mongoose-autopopulate'));

module.exports = collection.model('TransactionHistory', transactionHistorySchema);
