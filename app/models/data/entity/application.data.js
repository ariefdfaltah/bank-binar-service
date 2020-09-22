const schemeHelper = require('../../../helpers/scheme.helper');
const basicData = require('../system/basic.data');
const SchemeHelper = new schemeHelper();

const applicationData = {
    name: basicData.name("Aplikasi"),
    code: basicData.code("Aplikasi"),
    password: basicData.password,
    status: basicData.status
};

module.exports = {
    async applicationScheme() {
        return await SchemeHelper.mapToSystemScheme(applicationData)
    }
};
