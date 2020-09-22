const collection = require('mongoose');
const basicData = require('../../data/system/basic.data');

const applicationSchema = new collection.Schema(
    {
        name: basicData.name("Aplikasi"),
        code: basicData.code("Aplikasi"),
        password: basicData.password,
        status: basicData.status
    });

applicationSchema.set('timestamps', true);
applicationSchema.plugin(require('mongoose-paginate-v2'));
applicationSchema.plugin(require('mongoose-autopopulate'));

module.exports = collection.model('Application', applicationSchema);
