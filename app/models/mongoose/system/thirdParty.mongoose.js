const collection = require('mongoose');
const Schema = collection.Schema;
const basicData = require('../../data/system/basic.data');

const thirdPartySchema = new collection.Schema(
    {
        name: basicData.name("Pihak Ketiga"),
        application: {
            type: Schema.Types.ObjectId,
            required: false,
            ref : 'Application',
            autopopulate : {
                select: 'name code',
                maxDepth: 1
            }
        },
        public_key: basicData.public_key,
        secret_key: basicData.secret_key,
        status: basicData.status
    });

thirdPartySchema.set('timestamps', true);
thirdPartySchema.plugin(require('mongoose-paginate-v2'));
thirdPartySchema.plugin(require('mongoose-autopopulate'));

module.exports = collection.model('ThirdParty', thirdPartySchema);
