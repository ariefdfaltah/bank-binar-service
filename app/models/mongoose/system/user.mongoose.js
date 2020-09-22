const collection = require('mongoose');
const basicData = require('../../data/system/basic.data');

const userSchema = new collection.Schema(
    {
        email: basicData.username,
        password: basicData.password,
    });

userSchema.set('timestamps', true);
userSchema.plugin(require('mongoose-paginate-v2'));
userSchema.plugin(require('mongoose-autopopulate'));

module.exports = collection.model('User', userSchema);
