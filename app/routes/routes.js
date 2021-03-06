const verify = require('../middlewares/verifytoken');
const log = require('../middlewares/log');

module.exports = (app) => {
    app.use(log);

    //Initialize Other Route
    const applicationController = require('../controllers/entity/application.controller');
    const ac = new applicationController();
    const thirdPartyController = require('../controllers/system/thirdParty.controller');
    const tpc = new thirdPartyController();
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
    app.post('/user',verify, uc.store);
    //End of System User Route

    //Banking Bank Account Route
    const bankAccountController = require('../controllers/banking/bankAccount.controller');
    const ba = new bankAccountController();
    app.post('/bank/account/transfer/request',verify, ba.transfer);
    app.post('/bank/account/transfer',verify, ba.doTransfer);
    app.post('/bank/account/balance/request',verify, ba.balance);
    app.post('/bank/account/balance',verify, ba.getBalance);
    app.get('/bank/account',verify, ba.index);
    app.get('/bank/account/profile',verify, ba.profile);
    app.get('/bank/account/:id',verify, ba.show);
    app.post('/bank/account',verify, ba.store);
    //End of Banking Bank Account Route

    //Entity Application Route
    app.get('/application',verify, ac.index);
    app.get('/application/form',verify, ac.showForm);
    app.get('/application/profile',verify, ac.profile);
    app.get('/application/:id',verify, ac.show);
    app.post('/application',verify, ac.store);
    //End of Entity Application Route

    //System Third Party Route
    app.get('/third/party',verify, tpc.index);
    app.get('/third/party/form',verify, tpc.showForm);
    app.post('/third/party/authorize', verify, tpc.authorize);
    app.get('/third/party/:id',verify, tpc.show);
    app.post('/third/party',verify, tpc.store);
    //End of Third Party Route

    //Banking Transaction Code Route
    const transactionCodeController = require('../controllers/banking/transactionCode.controller');
    const tcc = new transactionCodeController();
    app.get('/transaction/code',verify, tcc.index);
    app.get('/transaction/code/:id',verify, tcc.show);
    app.post('/transaction/code',verify, tcc.store);
    //End of Banking Transaction Code Route
};
