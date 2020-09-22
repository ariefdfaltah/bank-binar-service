const schemeHelper = require('../../../helpers/scheme.helper');
const basicData = require('../system/basic.data');
const SchemeHelper = new schemeHelper();

const thirdPartyData = {
    application: basicData.application,
};

module.exports = {
    async thirdPartyScheme() {
        return await SchemeHelper.mapToSystemScheme(thirdPartyData)
    }
};
