const env = require('dotenv');
env.config();

module.exports = {
    url: process.env.MONGO
}
