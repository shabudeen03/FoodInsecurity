const { Router } = require('express');
const loginRouter = Router();
const passport = require('../config/passportConfig.js');

const loginController = require('../controllers/loginController.js');
loginRouter.get("/", loginController.getLogin);

loginRouter.post(
    "/", 
    loginController.validator, 
    loginController.postLogin,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

module.exports = { loginRouter };