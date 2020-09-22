const collection = require('mongoose');
const basicData = require('../../data/system/basic.data');

const transactionCodeSchema = new collection.Schema(
    {
            name: basicData.name("Kode Transaksi"),
            code: basicData.code("Kode Transaksi")
    });

transactionCodeSchema.set('timestamps', true);
transactionCodeSchema.plugin(require('mongoose-paginate-v2'));
transactionCodeSchema.plugin(require('mongoose-autopopulate'));

module.exports = collection.model('TransactionCode', transactionCodeSchema);
