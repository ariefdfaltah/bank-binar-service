const verify = require('../middlewares/verifytoken');
const log = require('../middlewares/log');

module.exports = (app) => {
    app.use(log);

    //Initialize Other Route
    const applicationController = require('../controllers/entity/application.controller');
    const ac = new applicationController();
    app.post('/application/auth/login', ac.login);
    //End of Initialize Other Route



    //System Auth Route
    const authController = require('../controllers/system/auth.controller');
    const auc = new authController();
    app.post('/auth/login', auc.login);
    //End of System Auth Route

    //System User Route
    const userController = require('../controllers/system/user.controller');
    const uc = new userController();
    // app.post('/user', uc.store);
    app.post('/user',verify, uc.store);
    //End of System User Route

    //Entity Application Route
    app.get('/application',verify, ac.index);
    app.get('/application/form',verify, ac.showForm);
    app.get('/application/profile',verify, ac.profile);
    app.get('/application/:id',verify, ac.show);
    app.post('/application',verify, ac.store);
    //End of Entity Application Route

    //System Third Party Route
    const thirdPartyController = require('../controllers/system/thirdParty.controller');
    const tpc = new thirdPartyController();
    app.get('/third/party',verify, tpc.index);
    app.get('/third/party/authorize', tpc.authorize);
    app.get('/third/party/form',verify, tpc.showForm);
    app.get('/third/party/:id',verify, tpc.show);
    app.post('/third/party',verify, tpc.store);
    //End of Third Party Route
};
