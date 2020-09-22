const collection = require('mongoose');
const basicData = require('../../data/system/basic.data');

const bankAccountSchema = new collection.Schema(
    {
        name: basicData.name("Pemegang Akun"),
        account_number: basicData.account_number,
        transaction_pin: basicData.transaction_pin,
        balance: basicData.custom_number("Saldo", "balance"),
        status: basicData.status
    });

bankAccountSchema.set('timestamps', true);
bankAccountSchema.plugin(require('mongoose-paginate-v2'));
bankAccountSchema.plugin(require('mongoose-autopopulate'));

module.exports = collection.model('BankAccount', bankAccountSchema);
